import { useParams, useNavigate, NavLink } from "react-router-dom";

import { useEffect, useState } from "react";
import {
  excludeUserFromClass,
  getStudentClasses,
  getUserMessages,
} from "../../../server/class";
import { formatDate } from "../../Utils/dates";
import "./MessagesSection.css";
import { showError, showOK } from "../../Utils/Notifications";
import HighlightedContent from "../../Utils/HighlightedContent";
const MessagesSection = () => {
  const { section } = useParams();
  const [messages, setMessages] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const messages = await getUserMessages();
      const classes = await getStudentClasses();
      if (messages) {
        setMessages(messages);
      } else {
        showError("Ошибка загрузки.");
      }

      if (classes) {
        setClasses(classes);
      } else {
        showError("Ошибка загрузки.");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleClassDelBut = async (cl) => {
    if (window.confirm(`Вы уверены, что хотите покинуть класс ${cl.name}?`)) {
      const res = await excludeUserFromClass({
        class_id: cl.id,
        excluded_user_id: -1,
      });
      if (res !== undefined) {
        showOK(`Вы покинули класс ${cl.name}.`);
        const classes = await getStudentClasses();
        if (classes) {
          setClasses(classes);
        } else {
          showError("Ошибка загрузки.");
        }
      } else {
        showError("Произошла ошибка.");
      }
    }
  };
  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className="lk-messages-section">
      <div>
        <h2>Мои классы</h2>
        <div>
          {classes.map((cl, i) => {
            return (
              <div className="class-item" key={cl.id}>
                <span>{`${i + 1}. ${cl.name}`}</span>
                <button
                  className="del-student"
                  onClick={() => {
                    handleClassDelBut(cl);
                  }}
                >
                  ⨉
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h2>Сообщения</h2>
        <div className="lk-messages">
          {messages.map((mes) => {
            return (
              <div key={mes.id} className="message">
                <div className="message-header">
                  <span>{mes.mes_class.name}</span>
                  <span>{formatDate(mes.created_at)}</span>
                </div>
                <hr></hr>

                <div className="message-content" key={mes.id}>
                  <HighlightedContent content={mes.content} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MessagesSection;
