package io.ionic.plugins.aaosdatautils.dataevent;
import android.util.NoSuchPropertyException;

import com.getcapacitor.JSObject;

public class DataValueEvent extends DataEvent {

    public DataValueEvent(int eventCode) {
        super(eventCode);
        this.put("data",new JSObject());
    }

    public void putData(String key, Object data) {
        JSObject dataContainer = this.getJSObject("data");
        if(dataContainer == null) {
            throw new NoSuchPropertyException("Missing property: 'data'");
        }
        dataContainer.put(key,data);
        this.put("data",dataContainer);
    }
}
