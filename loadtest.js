async function runCallTest(callerTester, calleeTester, appId) {
    await Promise.all([
        callerTester.cmd("init", appId),
        calleeTester.cmd("init", appId),
    ]);

    await Promise.all([
        callerTester.cmd("auth", callerTester._id),
        calleeTester.cmd("auth", calleeTester._id)
    ]);

    const callId = await callerTester.cmd("dial", calleeTester._id);

    await Promise.all([
        callerTester.cmd("waitConnected", callId),
        calleeTester.cmd("waitConnected", callId),
        calleeTester.cmd("accept", callId)
    ]);
    console.log('connected');

    this.sleep(600000);
    await Promise.all([
        callerTester.cmd("end", callId),
        calleeTester.cmd("end", callId)
    ]);
}

class Tester {
    constructor(chromeDriver) {
        this._id = uuid();
        this.driver = chromeDriver;
    }

    async cmd(cmdName, arg) {
        const execId = uuid();
        await this.driver.executeScript(  // selenium chrome driver
            `${cmdName}("${arg}", arguments[0]);`,
            execId
        );

        return this._getVal(execId, cmdName);
    }
}
