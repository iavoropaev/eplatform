import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createInvitation,
  createMessage,
  deleteInvitation,
  getClassbyId,
} from "../../server/class";

const ClassForTeacher = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState(undefined);
  const [newMessageContent, setNewMessageContent] = useState("");

  useEffect(() => {
    async function fetchData() {
      const classData = await getClassbyId(classId);
      if (classData) {
        setClassData(classData);
      }
    }
    fetchData();
  }, [classId]);

  const handleDeleteBut = async (id, index) => {
    console.log(id);
    const res = await deleteInvitation({ invitation_id: id });
    if (res) {
      const newInv = [...classData.invitations];
      newInv.splice(index, 1);
      setClassData({ ...classData, invitations: newInv });
    }
  };

  const handleNewInvBut = async () => {
    const newInv = await createInvitation({ class_id: classId });
    if (newInv) {
      setClassData({
        ...classData,
        invitations: [...classData.invitations, newInv],
      });
    }
  };

  const handleNewMesBut = async () => {
    const newMes = await createMessage({
      class_id: classId,
      content: newMessageContent,
    });
    if (newMes) {
      setClassData({
        ...classData,
        messages: [newMes, ...classData.messages],
      });
      setNewMessageContent("");
    }
  };

  if (!classData) {
    return <></>;
  }

  console.log(classData);

  return (
    <div>
      <h2>{`Класс: ${classData.name}.`}</h2>
      <div>
        <h3>Ученики</h3>
        {classData?.students.map((student, i) => {
          return (
            <div key={i}>{`${i + 1}. ${student.first_name} ${
              student.last_name
            }`}</div>
          );
        })}
      </div>
      <div>
        <h3>Сообщения</h3>
        {classData?.messages.map((mes) => {
          return <div key={mes.id}>{mes.content}</div>;
        })}
        <div>
          <h3>Отправить новое сообщение</h3>
          <textarea
            value={newMessageContent}
            onChange={(e) => {
              setNewMessageContent(e.target.value);
            }}
          ></textarea>
          <button onClick={handleNewMesBut}>Отправить</button>
        </div>
      </div>
      <div>
        <h3>Приглашения</h3>
        {classData?.invitations.map((inv, i) => {
          const link = `${process.env.REACT_APP_AUTH_REDIRECT_URL}class/activate-invitation/${inv.token}/`;
          return (
            <div key={i}>
              <span>{link}</span>{" "}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(link);
                }}
              >
                Копировать
              </button>
              <button
                onClick={() => {
                  console.log(inv.id);
                  handleDeleteBut(inv.id, i);
                }}
              >
                Удалить
              </button>
            </div>
          );
        })}
        <button onClick={handleNewInvBut}>Создать приглашение</button>
      </div>
    </div>
  );
};

export default ClassForTeacher;
