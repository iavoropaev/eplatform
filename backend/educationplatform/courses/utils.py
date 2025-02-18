from courses.models import Lesson, SectionSolve
from courses.serializers import LessonSerializer, SectionSolveSerializer, SectionSerializer, SectionAllFieldsSerializer


def get_lesson_data_with_solves(cur_lesson_id, cur_user_id):
    lesson = Lesson.objects.all().filter(id=cur_lesson_id)[0]
    lesson_serializer = LessonSerializer(lesson, many=False)
    section_ids = [section['id'] for section in lesson_serializer.data['sections']]

    solves = (SectionSolve.objects.all().filter(user=cur_user_id, section__in=section_ids)
              .order_by('section', '-score', '-time_create').distinct('section'))
    solve_serializer = SectionSolveSerializer(solves, many=True)

    lesson_data = lesson_serializer.data
    section_solve_dict = {solve['section']: solve for solve in solve_serializer.data}
    for section in lesson_data['sections']:
        if section['id'] in section_solve_dict:
            section['solve'] = section_solve_dict[section['id']]
        else:
            section['solve'] = None

    return lesson_data


def create_empty_section(user_id):
    data = {'created_by': user_id, 'content': '...', 'task': None, 'type': 'text', 'video': ""}
    serializer = SectionAllFieldsSerializer(data=data)
    if serializer.is_valid():
        new_section = serializer.save()
        return new_section
