import docker
import logging

client = docker.from_env()
logging.basicConfig(level=logging.INFO)

class DigitalTwinManager:
    def __init__(self, target_container_name: str):
        self.container_name = target_container_name

    def check_health(self) -> bool:
        """Verifies if the twin services are running and accessible."""
        try:
            container = client.containers.get(self.container_name)
            return container.status == 'running'
        except docker.errors.NotFound:
            logging.error(f"Container {self.container_name} not found.")
            return False

    def create_snapshot(self, snapshot_id: str) -> str:
        """Pauses the twin, commits the current state as a Docker image, and unpauses."""
        try:
            container = client.containers.get(self.container_name)
            container.pause()
            image = container.commit(repository=self.container_name, tag=snapshot_id)
            container.unpause()
            logging.info(f"Snapshot {snapshot_id} created successfully.")
            return image.id
        except Exception as e:
            logging.error(f"Snapshot creation failed: {e}")
            raise

    def rollback_snapshot(self, snapshot_id: str):
        """Stops the compromised twin and spins up the clean snapshot image."""
        try:
            old_container = client.containers.get(self.container_name)
            old_container.stop()
            old_container.remove()
            
            client.containers.run(
                f"{self.container_name}:{snapshot_id}",
                name=self.container_name,
                network="digital_twin_twin_isolated_net",
                detach=True
            )
            logging.info(f"Rolled back to snapshot {snapshot_id}.")
        except Exception as e:
            logging.error(f"Rollback failed: {e}")
            raise