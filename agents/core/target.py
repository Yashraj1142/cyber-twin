from dataclasses import dataclass, asdict
from typing import Optional


@dataclass
class DigitalTwinTarget:
    """
    Describes the authorized Digital Twin that agents may interact with.
    """

    twin_id: str
    base_url: str

    auth_endpoint: Optional[str] = None
    username_field: str = "username"
    password_field: str = "password"
    test_username: Optional[str] = None

    def get_auth_url(self) -> Optional[str]:
        if not self.auth_endpoint:
            return None

        return (
            self.base_url.rstrip("/")
            + "/"
            + self.auth_endpoint.lstrip("/")
        )

    def to_dict(self):
        return asdict(self)