class PendingCampaign {
    constructor(obj) {
        Object.assign(this, obj);
        this.ParamStrUnpacked = '';
        var paramObj = $.deparam(obj.ParamStr)
        Object.keys( paramObj ).forEach((key )=>{
            this.ParamStrUnpacked += key + " = " + paramObj[key] + "; ";
        })
    }
}
