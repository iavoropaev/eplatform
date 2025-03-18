import { useState } from "react";
import { formatDate } from "../../Utils/dates";
import { useNavigate, useParams } from "react-router-dom";
import {
  createMessage,
  deleteClass,
  deleteMessage,
} from "../../../server/class";
import { showError, showOK } from "../../Utils/Notifications";

export const ClassMessages = ({ classData, setClassData }) => {
  const navigate = useNavigate();
  const { classId } = useParams();

  const [newMessageContent, setNewMessageContent] = useState("");

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
      showOK("Сообщение отправлено!");
    } else {
      showError("Ошибка.");
    }
  };

  const handleMessageDelete = async (id) => {
    if (window.confirm("Удалить сообщение?")) {
      const res = await deleteMessage({
        message_id: id,
      });
      if (res) {
        const newMessages = classData.messages.filter((mes) => mes.id !== id);
        setClassData({
          ...classData,
          messages: newMessages,
        });
      } else {
        showError("Ошибка.");
      }
    }
  };

  const handleDelClassBut = async () => {
    if (window.confirm("Вы уверены, что хотите удалить класс?")) {
      const res = await deleteClass({ class_id: classId });
      if (res !== undefined) {
        navigate("/");
        showOK("Класс удалён.");
      } else {
        showError("Не удалось удалить класс.");
      }
    }
  };

  return (
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
            <div className="message" key={mes.id}>
              <div className="message-header">
                <span>{formatDate(mes.created_at)}</span>
                <div
                  onClick={() => {
                    handleMessageDelete(mes.id);
                  }}
                >
                  {/* <button>Редактировать</button> */}
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
      <div className="class-delete">
        <details>
          <summary>Удаление класса</summary>
          <button onClick={handleDelClassBut}>Удалить класс</button>
        </details>
      </div>
    </div>
  );
};
