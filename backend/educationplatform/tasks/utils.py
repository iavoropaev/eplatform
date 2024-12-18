def check_answer(user_answer, true_answer):
    is_ok = True
    print([user_answer, true_answer])
    if true_answer['type'] == 'text':
        return str(user_answer['text']).strip() == str(true_answer['text']).strip()
    if true_answer['type'] == 'table':
        true_table = true_answer['table']
        user_table = user_answer['table']
        if len(true_table) == len(user_table):
            for row in range(len(true_table)):
                if len(true_table[row]) == len(user_table[row]):
                    for col in range(len(true_table[row])):
                        if str(true_answer['table'][row][col]).strip() != str(user_answer['table'][row][col]).strip():
                            is_ok = False
                else:
                    is_ok = False
        else:
            is_ok = False
        return is_ok

    return False