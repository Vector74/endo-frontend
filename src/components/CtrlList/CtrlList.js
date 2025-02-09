import React from "react";
import { BsFillTrashFill, BsFillPencilFill, BsPrinterFill } from "react-icons/bs";
import "./CtrlList.css";

export default function CtrlList({ columns, rows, deleteRow, editRow, printRow }) {
    const localColumns = columns ?? (rows.length > 0 ? Object.keys(rows[0]).map((key) => { return { title: key, field: key }; }, []) : []);

    const hasClickProc = deleteRow !== undefined || editRow !== undefined || printRow !== undefined;
    return (
        <div className="table-wrapper">
            <table className="table">
                <thead>
                    <tr>
                        {
                            localColumns.map((item, index) => {
                                return <th key={"th" + index} className="fit">{item.title}</th>
                            })
                        }
                        {hasClickProc && <th className="fit">Action</th>}
                    </tr>

                </thead>
                <tbody>
                    {
                        rows.map((row, idx) => {
                            return (
                                <tr key={idx}>
                                    {
                                        localColumns.map((item) => {
                                            return (<td className="fit">
                                                {
                                                    item.selectitem.length === 0 ?
                                                        row[item.field] : item.selectitem.length > 0 ?
                                                            (item.selectitem.find(
                                                                (element) => {
                                                                    // eslint-disable-next-line eqeqeq
                                                                    return element.value == row[item.field];
                                                                }) ?? { text: row[item.field] }).text : row[item.field]
                                                }
                                            </td>)
                                        })

                                    }
                                    {hasClickProc &&
                                        <td className="col-sm-1">
                                            <span className="actions">
                                                <BsFillTrashFill
                                                    className="delete-btn"
                                                    onClick={() => deleteRow(idx)}
                                                />
                                                <BsFillPencilFill
                                                    className="edit-btn"
                                                    onClick={() => editRow(idx)}
                                                />
                                                <BsPrinterFill
                                                    className="edit-btn"
                                                    onClick={() => printRow(idx)}
                                                >
                                                </BsPrinterFill>
                                            </span>
                                        </td>
                                    }
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};