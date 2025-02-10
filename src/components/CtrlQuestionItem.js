import { Translate } from "../core_utils/utils";
import ReactStars from "react-stars"

export default function CtrlQuestionItem(id, question, questionType, ratingChanged, value) {
  let item;
  switch (questionType) {
    case "text": item =
      <div class="container text-left">
        <div class="row">
          <div class="col-sm-12">
            {Translate(question)}
          </div>
          <div class="col-sm-10 d-flex flex-column flex-row">
            <textarea
              class="input-edit-note"
              onChange={(e) => ratingChanged(e.target.value, id)}
              style={{
                height: "150px",
                padding: "15px",
                borderRadius: "5px",
                outline: "none",
                resize: "none"
              }}
              value={value}
            />
          </div>
        </div>
      </div>
      break
    case "star": item =
      <div class="container text-left">
        <div class="row">
          <div class="col-sm-10">
            {Translate(question)}
          </div>
          <div class="col-sm-2">
            <ReactStars
              count={5}
              onChange={(new_rating) => ratingChanged(new_rating, id)}
              size={24}
              color2={"#ffd700"}
              value={value}
            />,
          </div>
        </div>
      </div>
      break
    default:
      item = <div class="container text-left">
        <div class="row">
          <div class="col-10">
            <h3>{Translate(question)}</h3>
          </div>
        </div>
      </div>
      break
  }
  return item;

}