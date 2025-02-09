export default function RenderEmailBodyToAdmin(userName, email, resultDatas) {
   const items = resultDatas.map((item) => {
        switch (item.questiontype) {
            case "star": return <span><b>{item.question}</b><span>Az ön válasza: {item.star}</span></span>;
            case "text": return <span><b>{item.question}</b><span>Az ön válasza: {item.text}</span></span>;
            default: return <span></span>;
        }
   });
    return (
        <span>
            <h1>Értékelés érkezett!</h1>
            <br></br>
            Felhasználó {userName}, {email} részéről értékelés érkezett az alábbi adatokkal.
            {items}
            <br></br>
            Köszönettel endo-kapszula magánorvosi centrum.
        </span>
    );
}