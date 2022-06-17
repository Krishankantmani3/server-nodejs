import console from "console";


export function printConsoleLog(className: string, methodName: string, message: any) {
    let messageObj = { className, methodName, message };
    console.log(messageObj);
}

export function printErrorLog(className: string, methodName: string, error: any) {
    let errorObj = { className, methodName, error };
    console.log(errorObj);
}

export function printConsoleMessage(msg: any) {
    console.log(msg);
}

