package io.ionic.plugins.aaosdatautils.dataview;

import com.getcapacitor.JSArray;

import io.ionic.plugins.aaosdatautils.dataevent.DataEvent;

public abstract class DataView<T> {

    protected int dataId;
    RingBuffer events = new RingBuffer();

    private T callback;

    public DataView(Integer dataId) {
        this.dataId = dataId;
    }

    public void insertEvent(DataEvent dataEvent) {
        this.events.add(dataEvent);
    }

    public DataEvent getMostRecentEvent() {
        return this.events.get();
    }

    public JSArray getAllEvents() {
        return this.events.getAllEvents();
    }

    public T getCallback() {
        return callback;
    }

    public void setCallback(T callback) {
        this.callback = callback;
    }

}
