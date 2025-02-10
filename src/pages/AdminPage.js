import AdminQuestions from "./AdminQuestions.js";
import AdminQuestionsHead from "./AdminQuestionHead.js";


export default function AdminPage({ loggedUserId, token }) {

    return <>
        <AdminQuestions loggedUserId={loggedUserId} token={token} />
        <AdminQuestionsHead loggedUserId={loggedUserId} token={token} />
    </>
}

