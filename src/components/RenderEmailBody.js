export default function RenderEmailBody(userName, resultDatas) {
   const items = resultDatas.map((item) => {
        switch (item.questiontype) {
            case "star": return <span><b>{item.question}</b><span>Az ön válasza: {item.star}</span></span>;
            case "text": return <span><b>{item.question}</b><span>Az ön válasza: {item.text}</span></span>;
            default: return <span></span>;
        }
   });
    return (
        <span>
            <h1>Tisztelt {userName}!</h1>
            <br></br>
            Köszönjük a visszajelzést!
            <br></br>
            Ön az alábbi válaszokat adta kérdéseinkre.
            {items}
            <br></br>
            Köszönettel endo-kapszula magánorvosi centrum.
        </span>
    );
}