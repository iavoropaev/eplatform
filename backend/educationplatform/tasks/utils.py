import re


def check_answer(user_answer, true_answer, max_score=1, check_rule='default'):
    ok_sol = {'score': max_score, 'status': 'OK'}
    wa_sol = {'score': 0, 'status': 'WA'}

    if true_answer['type'] == 'open_answer':
        if user_answer['open_answer'].strip() != '':
            return ok_sol
        else:
            return wa_sol

    if true_answer['type'] == 'text':
        user_text = str(user_answer.get('text', '')).strip()
        true_text = str(true_answer.get('text', '')).strip()

        if user_text == true_text:
            return ok_sol
        try:
            if re.fullmatch(true_text, user_text):
                return ok_sol
        except re.error:
            return wa_sol
        return wa_sol

    if true_answer['type'] == 'choice':
        true_choice = true_answer['choice']
        user_choice = user_answer['choice']
        if len(true_choice) == len(user_choice):
            if true_choice == user_choice:
                return ok_sol
            else:
                return wa_sol
        return wa_sol

    if true_answer['type'] == 'comparison':
        true_sorting = true_answer['comparison']
        user_sorting = user_answer['comparison']
        if len(true_sorting) == len(user_sorting):
            if all(pair in user_sorting for pair in true_sorting):
                return ok_sol
            else:
                return wa_sol
        return wa_sol

    if true_answer['type'] == 'sorting':
        true_sorting = true_answer['sorting']
        user_sorting = user_answer['sorting']
        if len(true_sorting) == len(user_sorting):
            if true_sorting == user_sorting:
                return ok_sol
            else:
                return wa_sol
        return wa_sol

    if true_answer['type'] == 'table':
        count_ok, count_all = 0, 0
        true_table = true_answer['table']
        user_table = user_answer['table']
        while user_table and not any(user_table[-1]):
            user_table.pop()

        for row in true_table:
            count_all += len(row)

        if len(true_table) >= len(user_table):
            for row in range(len(user_table)):
                if len(true_table[row]) >= len(user_table[row]):
                    for col in range(len(user_table[row])):
                        if str(true_table[row][col]).strip() == str(user_table[row][col]).strip():
                            count_ok += 1
                else:
                    return wa_sol
        else:
            return wa_sol


        status = 'WA'
        if count_ok == count_all:
            status = 'OK'
        elif count_ok > 0:
            status = 'PA'

        score = max_score if status == 'OK' else 0
        if check_rule == 'percent':
            score = int(max_score * (count_ok / count_all))
        return {'score': score, 'status': status}
    return wa_sol
