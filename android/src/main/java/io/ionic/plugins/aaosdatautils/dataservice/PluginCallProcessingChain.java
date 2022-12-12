package io.ionic.plugins.aaosdatautils.dataservice;

import android.util.Log;

import com.getcapacitor.PluginCall;

import java.util.ArrayList;
import java.util.List;

import io.ionic.plugins.aaosdatautils.dataerror.DataErrorHandler;


public class PluginCallProcessingChain {

    private final List<PluginCallProcessor> processingChain = new ArrayList<>();
    private final DataErrorHandler dataErrorHandler;

    public PluginCallProcessingChain(DataErrorHandler dataErrorHandler) {
        this.dataErrorHandler = dataErrorHandler;
        Log.e("PluginCallProcessingChain","Loading the data error handler: " + this.dataErrorHandler);
    }

    public PluginCallProcessingChain add(PluginCallProcessor processor) {
        processingChain.add(processor);
        return this;
    }

    private void execute(PluginCall pluginCall) {
        for(PluginCallProcessor pluginCallProcessor : this.processingChain) {
            pluginCallProcessor.processPluginCall(pluginCall);
        }
    }

    public void executeWithFinal(PluginCall pluginCall, PluginCallProcessor finalProcessor) {
        try{
            this.execute(pluginCall);
            finalProcessor.processPluginCall(pluginCall);
        } catch(Exception e) {
            this.dataErrorHandler.handle(e,pluginCall);
        }
    }
}
