import { useParams } from "react-router-dom";
import { createInvitation, deleteInvitation } from "../../../server/class";

export const ClassStudents = ({ classData, setClassData }) => {
  const { classId } = useParams();

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

  return (
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
  );
};
