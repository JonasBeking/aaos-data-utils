package io.ionic.plugins.aaosdatautils.dataview;

import com.getcapacitor.JSArray;
import io.ionic.plugins.aaosdatautils.dataevent.DataEvent;

public class RingBuffer {

    private final int size = 16;
    private int read = 0;
    private int write = 0;
    private final DataEvent[] buffer = new DataEvent[size];

    private void incrementRead() {
        this.read = (this.read + 1) & (this.size - 1);
    }

    private void incrementWrite() {
        this.write = (this.write + 1) & (this.size - 1);
    }

    void add(DataEvent data) {
        this.incrementWrite();
        this.buffer[this.write] = data;
        this.read = this.write;
    }

    DataEvent get() {
        return this.buffer[this.read];
    }

    public JSArray getAllEvents() {
        JSArray chronoOrderedEvents = new JSArray();

        int bufferIndex = this.read;
        for(int i = 0; i < this.size; i++) {
            chronoOrderedEvents.put(this.buffer[bufferIndex]);
            bufferIndex = (bufferIndex - 1) & (this.size - 1);
        }
        return chronoOrderedEvents;
    }
}
