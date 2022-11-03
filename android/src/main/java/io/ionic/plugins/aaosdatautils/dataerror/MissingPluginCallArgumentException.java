package io.ionic.plugins.aaosdatautils.dataerror;

import androidx.annotation.NonNull;

public class MissingPluginCallArgumentException extends RuntimeException{

    private final String missingArgument;

    public MissingPluginCallArgumentException(String missingArgument) {
        this.missingArgument = missingArgument;
    }

    @NonNull
    @Override
    public String toString() {
        return "Missing argument: " + this.missingArgument;
    }
}
