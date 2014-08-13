class Customer {
    constructor(obj) {
        Object.assign(this, obj);
        // this._Alpha = {AvailableCredit : obj.AvailableCredit}
        this.OrderingMethods = [ for(x of Object.keys({CrxSetup: obj.CrxSetup,
                                    CSOSSetup: obj.CSOSSetup,
                                    EWOMSetup: obj.EWOMSetup,
                                    PBAOSetup: obj.PBAOSetup}) )if (obj[x] == 0) x].toString();
    }
}
