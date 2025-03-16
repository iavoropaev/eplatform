import { useParams, useNavigate, NavLink } from "react-router-dom";

import { useEffect, useState } from "react";
import { getUserMessages } from "../../../server/class";
import { formatDate } from "../../Utils/dates";
import "./MessagesSection.css";
import { showError } from "../../Utils/Notifications";
const MessagesSection = () => {
  const { section } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const messages = await getUserMessages();
      if (messages) {
        setMessages(messages);
      } else {
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, []);
  console.log(messages);

  return (
    <div className="lk-messages-section">
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
              <div
                className="message-content"
                key={mes.id}
                dangerouslySetInnerHTML={{ __html: mes.content }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesSection;
