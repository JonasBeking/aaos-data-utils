package io.ionic.plugins.aaosdatautils.dataevent;

public class DataErrorEvent extends DataEvent {

    public DataErrorEvent(String reason) {
        super(-1);
        this.put("reason",reason);
    }

    public String getReason() {
        return this.getString("reason");
    }
}
