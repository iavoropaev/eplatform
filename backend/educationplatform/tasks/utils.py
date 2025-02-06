def check_answer(user_answer, true_answer):
    print(user_answer, true_answer)
    is_ok = True

    if true_answer['type'] == 'text':
        return str(user_answer['text']).strip() == str(true_answer['text']).strip()

    if true_answer['type'] == 'choice':
        true_choice = true_answer['choice']
        user_choice = user_answer['choice']
        if len(true_choice) == len(user_choice):
            return true_choice == user_choice
        return False

    if true_answer['type'] == 'comparison':
        true_sorting = true_answer['comparison']
        user_sorting = user_answer['comparison']
        if len(true_sorting) == len(user_sorting):
            return all(pair in user_sorting for pair in true_sorting)
        return False

    if true_answer['type'] == 'table':
        true_table = true_answer['table']
        user_table = user_answer['table']
        while user_table and not any(user_table[-1]):
            user_table.pop()
        if len(true_table) == len(user_table):
            for row in range(len(true_table)):
                if len(true_table[row]) == len(user_table[row]):
                    for col in range(len(true_table[row])):
                        if str(true_table[row][col]).strip() != str(user_table[row][col]).strip():
                            is_ok = False
                else:
                    is_ok = False
        else:
            is_ok = False
        return is_ok
    return False
