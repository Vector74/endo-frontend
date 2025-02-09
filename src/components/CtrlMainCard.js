import Card from "react-bootstrap/Card";
import { Children } from "react";

export function CtrlMainCard({title, children}) {
    return <Card style={{ 
        width: "auto" }}>
        <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>
                {Children.map(children, child => child )}
            </Card.Text>
        </Card.Body>
    </Card>
}