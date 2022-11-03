package io.ionic.plugins.aaosdatautils.dataevent;

import com.getcapacitor.JSObject;

public class ErrorEvent extends JSObject {

    public ErrorEvent(String reason) {
        this.put("timestamp",System.currentTimeMillis());
        this.put("event","error");
        this.put("reason",reason);
    }

    public String getReason() {
        return this.getString("reason");
    }
}
