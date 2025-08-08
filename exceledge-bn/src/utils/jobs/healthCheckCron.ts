import axios from 'axios';
import cron from 'node-cron';

export class HealthCheckCronService {
  private static readonly HEALTH_CHECK_URL = `${process.env.BASE_URL}/api/v1/health-check`;
  private static readonly CRON_SCHEDULE = '*/10 * * * *'; // Every 10 minutes

  static initHealthCheckCron() {
    // Schedule health check to run every 10 minutes
    cron.schedule(HealthCheckCronService.CRON_SCHEDULE, async () => {
      try {
        console.log('Running health check...');
        const response = await axios.get(HealthCheckCronService.HEALTH_CHECK_URL);
        
        if (response.status === 200) {
          console.log('✅ Health check successful:', response.data);
        } else {
          console.error('❌ Health check failed with status:', response.status);
        }
      } catch (error) {
        console.error('❌ Error during health check:', error instanceof Error ? error.message : 'Unknown error');
      }
    });

    console.log('Health check cron job initialized...');
  }
}

export default HealthCheckCronService;
