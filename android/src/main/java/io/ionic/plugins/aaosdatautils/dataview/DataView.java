package io.ionic.plugins.aaosdatautils.dataview;

import com.getcapacitor.JSObject;

public abstract class DataView<T> {

    protected int dataId;
    private boolean overwriteOldEvents;
    private JSObject mostRecentEvent;
    //List<JSObject> events = new ArrayList<>();
    RingBuffer events = new RingBuffer();

    private T callback;

    public DataView(Integer dataId, Boolean overwriteOldEvents) {
        this.dataId = dataId;
        this.setOverwriteOldEvents(overwriteOldEvents);
    }

    public void insertEvent(JSObject event) {
        this.mostRecentEvent = event;
        if(this.overwriteOldEvents) {
            this.events.overwriteRead(event);
        }
        else{
            this.events.add(event);
        }
    }

    public JSObject getOldestEvent() {
        if(this.overwriteOldEvents) {
            return this.mostRecentEvent;
        }
        return this.events.get();
    }

    public T getCallback() {
        return callback;
    }

    public void setCallback(T callback) {
        this.callback = callback;
    }

    public void setOverwriteOldEvents(boolean overwriteOldEvents) throws UnsupportedOperationException{
        this.overwriteOldEvents = overwriteOldEvents;
    }
}
