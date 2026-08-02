from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()


@receiver(pre_save, sender=UserProfile)
def delete_old_resume(sender, instance, **kwargs):
    """Delete the previous resume from GridFS when a new one is uploaded."""
    if not instance.pk:
        return
    try:
        old = UserProfile.objects.get(pk=instance.pk)
    except UserProfile.DoesNotExist:
        return
    if old.resume and old.resume.name != instance.resume.name:
        old.resume.delete(save=False)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a UserProfile automatically when a new User is created"""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save the UserProfile when the User is saved"""
    if hasattr(instance, 'user_profile'):
        instance.user_profile.save()
