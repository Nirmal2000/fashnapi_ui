// src/lib/api.js
export async function initializeTryOnTask(payload, apiToken) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
  
    try {
      console.log('[Debug initializeTryOnTask] Starting try-on task initialization...');
      
      const response = await fetch("https://api.fashn.ai/v1/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to start try-on");
      }
  
      const data = await response.json();
      if (!data.id) throw new Error("Try-on initialization failed");
  
      return data.id;
    } catch (error) {
      console.error('Error details:', error);
      throw new Error(error.name === 'AbortError' ? "Request timed out" : `Network error: ${error.message}`);
    } finally {
      clearTimeout(timeout);
    }
  }
  
  export async function pollTaskStatus(task_id, apiToken) {
    let tries = 0;
    const maxTries = 30;
  
    while (tries < maxTries) {
      await new Promise(r => setTimeout(r, 2000));
      tries++;
  
      const statusController = new AbortController();
      const statusTimeout = setTimeout(() => statusController.abort(), 60000);
  
      try {
        console.log(`[Debug pollTaskStatus] Attempt ${tries}/${maxTries} for task ${task_id}`);
        console.log(`[Debug pollTaskStatus] Time elapsed: ${tries * 2}s`);
  
        const response = await fetch(`https://api.fashn.ai/v1/status/${task_id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiToken}`,
          },
          signal: statusController.signal
        });
  
        if (!response.ok) throw new Error("Failed to get status");
  
        const data = await response.json();
        console.log(`Status check for task ${task_id}:`, data);
        if (data.status === "completed" && data.output?.[0]) {
          return { status: "completed", progress: 100, url: data.output[0] };
        }
        if (data.status !== "in_queue" && data.status !== "processing" && data.status !== "starting") {
          throw new Error(data.error || "Try-on failed");
        }
  
        const progress = Math.min(92, (tries / maxTries) * 100);
        return { status: data.status, progress, url: null };
      } catch (error) {
        console.error('Status check error:', error);
        throw new Error(error.name === 'AbortError' ? "Status check timed out" : `Connection lost: ${error.message}`);
      } finally {
        clearTimeout(statusTimeout);
      }
    }
    throw new Error("Processing timeout");
  }