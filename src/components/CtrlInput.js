export default function CtrlInput({ name, placeholder, label, value, setValue, items, type }) {
    function renderLabel(label) {
        if ((label ?? "") !== "") {
            return (
                <div class="col-sm-2 d-flex flex-column flex-row">
                    <label class="font-semibold capitalize">
                        {label}
                    </label>
                </div>
            );
        } else {
            return <span></span>
        }
    }
    const dynClass = (label ?? "") !== "" ? "col-sm-10 d-flex flex-column flex-row mb-1" : "col-sm-12 d-flex flex-column flex-row mb-1";


    return (
        <div class="row">
            {renderLabel(label)}
            <div class={dynClass}>
                {
                    (items ?? []).length === 0 ?
                        <input
                            value={value}
                            name={name}
                            onChange={setValue}
                            placeholder={placeholder}
                            type={type}
                        /> : <>  
                            <select value={value} name={name} onChange={setValue}>
                                {
                                    items.map((item) => {
                                        return (
                                            <option value={item.value}>{item.text}</option>)
                                    })
                                }
                            </select>
                        </>
                }

            </div>
        </div>
    )
}

