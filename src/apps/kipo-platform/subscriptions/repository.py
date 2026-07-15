from abc import ABC, abstractmethod

from subscriptions.subscription import Subscription
from tenant.value_objects.tenant_id import TenantId


class ISubscriptionRepository(ABC):

    @abstractmethod
    def save(self, subscription: Subscription) -> Subscription: ...

    @abstractmethod
    def find_by_tenant_id(self, tenant_id: TenantId) -> Subscription | None: ...

    @abstractmethod
    def find_by_stripe_subscription_id(self, stripe_subscription_id: str) -> Subscription | None: ...

    @abstractmethod
    def find_by_stripe_customer_id(self, stripe_customer_id: str) -> Subscription | None: ...
