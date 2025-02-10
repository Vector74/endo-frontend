export class SqlCommandRequest {
    constructor(sql) {
        this.cmd = "sql_command";
        this.data = {
            "sql": sql
        };
    }
}

export class EmailCommandRequest {
    constructor(to, subject, message) {
        this.cmd = "email";
        this.data = {
            "to": to,
            "subject": subject,
            "message": message
        };
    }
}

export class LoginCommandRequest {
    constructor(email, psw) {
        this.cmd = "login";
        this.data = {
            "email": email,
            "psw": psw
        };
    }
}

function generateData(data) {
    const newData = {};
    Object.keys(data).map((key) => {
        return Object.assign(newData, {
            [key]: data[key]
        });
    }, []);
    return newData;
}

export class SqlCommandResponse {
    constructor(jsonDatas = { "data": [] }) {
        this.data = jsonDatas.map((item) => {
            return generateData(item);
        });
    }
}


export class LoginCommandResponse {
    constructor(data) {
        this.cmd = "sql_command";
        this.data = {
            "sql": data
        };
    }
}

export class APIResponse {
    constructor(json = { "errorcode": 0, "data": {} }) {
        this.errorcode = json.errorcode;
        this.data = json.data;
    }
}