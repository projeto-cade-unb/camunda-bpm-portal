package com.ambientelivre.plugin;

import java.util.List;

import javax.websocket.server.PathParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginRootResource;

import com.ambientelivre.plugin.dto.ProcessDefinitionDocumentationAuthorizationDto;
import com.ambientelivre.plugin.service.ProcessDefinitionDocumentationService;

@Path("plugin/" + CockpitPlugin.ID)
public class CockpitPluginRootResource extends AbstractCockpitPluginRootResource {
  private static final String ENGINE_NAME = "default";
  private ProcessDefinitionDocumentationService processDefinitionDocumentationService;

  public CockpitPluginRootResource() {
    super(CockpitPlugin.ID);
    processDefinitionDocumentationService = subResource(new ProcessDefinitionDocumentationService(ENGINE_NAME),
        ENGINE_NAME);
  }

  @GET
  @Path("/")
  @Produces(MediaType.TEXT_HTML)
  public Response index() {
    return standaloneWebappResponse();
  }

  @GET
  @Path("/{any:.*}")
  @Produces(MediaType.TEXT_HTML)
  public Response handleUnmatchedPaths(@PathParam("any") String any) {
    return standaloneWebappResponse();
  }

  @GET
  @Path("process-definition")
  @Produces(MediaType.APPLICATION_JSON)
  public ProcessDefinitionDocumentationAuthorizationDto findManyProcessDefinitionDocumentation(
      @QueryParam("processDefinitionKey") String processDefinitionKey) {
    return processDefinitionDocumentationService.findManyProcessDefinitionDocumentation(processDefinitionKey);
  }

  @Override
  protected List<String> getAllowedAssets() {
    return List.of(
        "app/plugin.js",
        "app/plugin.css",
        "app/styles.css",
        "app/main.js",
        "app/polyfills.js",
        "app/index.html",
        "app/media/Inter-roman.var.woff2");
  }

  private Response standaloneWebappResponse() {
    return getAsset("app/index.html");
  }
}
