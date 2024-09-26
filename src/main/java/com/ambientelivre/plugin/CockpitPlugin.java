package com.ambientelivre.plugin;

import java.util.HashSet;
import java.util.Set;

import org.camunda.bpm.cockpit.plugin.spi.impl.AbstractCockpitPlugin;
import com.ambientelivre.plugin.controller.CockpitPluginRootResource;

public class CockpitPlugin extends AbstractCockpitPlugin {
    static public final String ID = "portal-documentation";

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public Set<Class<?>> getResourceClasses() {
        Set<Class<?>> classes = new HashSet<>();

        classes.add(CockpitPluginRootResource.class);

        return classes;
    }
}
