import httpx
from aiogram.types import Message
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.user import User
from database.requests import get_user, set_access_token
from lexicon.lexicon import LOGOUT_TEXT


async def link_unlink_account(session: AsyncSession, message: Message, args, domain):
    invitation = args[1].strip()

    # Log out
    if invitation == 'logout':
        await logout(session=session, message=message, domain=domain)
        return
    else:
        # Log in
        await login(session=session, message=message, invitation=invitation, domain=domain)


async def login(session: AsyncSession, message: Message, invitation: str, domain: str):
    data = {'invitation': invitation, 'tg_id': message.chat.id}
    async with httpx.AsyncClient(timeout=5) as client:
        try:
            resp = await client.post(f'{domain}api/v1/users/activate-tg-invitation/',
                                     json=data,
                                     headers={"Content-Type": "application/json"}
                                     )
            resp.raise_for_status()
            res_data = resp.json()
        except Exception as e:
            print(e)
            await message.answer(f"❌ Ошибка")
            return
    try:
        access_token = 'Bearer ' + res_data['access_token']
        res = await set_access_token(session=session, telegram_id=message.from_user.id, access_token=access_token)
        if res:
            await message.answer(
                "✅ Ваш Telegram успешно привязан к аккаунту! Обновите страницу, чтобы данная информация отобразилась на сайте.")
        else:
            await message.answer(f"❌ Ошибка")
    except:
        await message.answer(f"❌ Ошибка")
    return


async def logout(session: AsyncSession, message: Message, domain: str):
    user = await get_user(
        session=session,
        telegram_id=message.from_user.id
    )
    print(user)
    if user.access_token is not None:
        async with httpx.AsyncClient(timeout=5) as client:
            try:
                resp = await client.post(f'{domain}api/v1/users/delete-tg-link/',
                                         headers={"Content-Type": "application/json",
                                                  "Authorization": user.access_token}
                                         )
                resp.raise_for_status()
                res_data = resp.json()
            except Exception as e:
                print(e)
                await message.answer(f"❌ Ошибка. Вы не отвязали телеграм аккаунт.")
                return
        if res_data == 'unlinked':
            await set_access_token(session=session,
                                   telegram_id=message.from_user.id,
                                   access_token=None
                                   )
            await message.answer(LOGOUT_TEXT)
        elif res_data == 'already-unlinked' or user.access_token is None:
            await message.answer("❌ Телеграмм аккаунт не был привязан.")
        else:
            await message.answer(f"❌ Ошибка")
    else:
        await message.answer("❌ Телеграмм аккаунт не был привязан.")
    return
