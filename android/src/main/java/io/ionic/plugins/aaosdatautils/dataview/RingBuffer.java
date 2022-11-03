package io.ionic.plugins.aaosdatautils.dataview;

import com.getcapacitor.JSObject;

public class RingBuffer {

    private final int size = 16;
    private int read = 0;
    private int write = 0;
    private final JSObject[] buffer = new JSObject[size];

    void add(JSObject data) {
        buffer[write] = data;
        write = (write + 1) & (size-1);
    }

    void overwriteRead(JSObject data) {
        buffer[read] = data;
    }

    JSObject get() {
        JSObject data = buffer[read];
        buffer[read] = null;
        read = (read + 1) & (size-1);
        return data;
    }
}
