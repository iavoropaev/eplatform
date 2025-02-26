import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createInvitation,
  createMessage,
  deleteInvitation,
  getClassbyId,
} from "../../server/class";
import "./ClassForTeacher.css";

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
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!classData) {
    return <></>;
  }

  console.log(classData);

  return (
    <div className="teacher-class">
      <h2>{classData.name}</h2>
      <div className="stud-mes-cont">
        <div className="students">
          <h3>Ученики</h3>
          <div>
            {classData?.students.map((student, i) => {
              return (
                <div key={i}>{`${i + 1}. ${student.first_name} ${
                  student.last_name
                }`}</div>
              );
            })}
          </div>

          <details>
            <summary>Приглашения</summary>
            <div className="invitations">
              {classData?.invitations.map((inv, i) => {
                const link = `${i + 1}. ${
                  process.env.REACT_APP_AUTH_REDIRECT_URL
                }class/activate-invitation/${inv.token}/`;
                return (
                  <div key={i} className="invitation">
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
              <button className="new-inv-but" onClick={handleNewInvBut}>
                Создать приглашение
              </button>
            </div>
          </details>
        </div>

        <div className="messages-cont">
          <h3>Сообщения</h3>
          <details className="new-message">
            <summary>Отправить новое сообщение</summary>
            <div className="new-message">
              <div>
                <textarea
                  value={newMessageContent}
                  onChange={(e) => {
                    setNewMessageContent(e.target.value);
                  }}
                ></textarea>
              </div>

              <button onClick={handleNewMesBut}>Отправить</button>
            </div>
          </details>

          <div className="messages">
            {classData?.messages.map((mes) => {
              console.log(mes);
              return (
                <div className="message">
                  <div className="message-header">
                    <span>{formatDate(mes.created_at)}</span>
                    <div>
                      <button>Редактировать</button>
                      <button>Удалить</button>
                    </div>
                  </div>
                  <hr></hr>
                  <div
                    className="content"
                    key={mes.id}
                    dangerouslySetInnerHTML={{ __html: mes.content }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassForTeacher;
