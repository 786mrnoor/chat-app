export function generateSystemMessage(meta = {}, userId, members) {
  const {
    type,
    actorId, // person who performed the action
    targetId, // person affected by the action
    groupName, // name of the group (if applicable)
    newName, // new group name
  } = meta;
  const actor = userId === actorId ? 'You' : members?.find((m) => m._id === actorId)?.name;
  const targetUser = userId === targetId ? 'You' : members?.find((m) => m._id === targetId)?.name;

  switch (type) {
    case 'group_created':
      return `${actor} created the group${groupName ? ` "${groupName}"` : ''}`;

    case 'user_join':
      return `${actor} joined the group`;

    case 'user_added':
      return `${targetUser} was added by ${actor}`;

    case 'user_leave':
      return `${actor} left the group`;

    case 'user_removed':
      return `${targetUser} was removed by ${actor}`;

    case 'group_rename':
      return `${actor} changed the group name to "${newName}"`;

    case 'group_photo_change':
      return `${actor} changed the group photo`;

    case 'group_photo_remove':
      return `${actor} removed the group photo`;

    case 'group_description_change':
      return `${actor} updated the group description`;

    case 'admin_grant':
      return `${actor} made ${targetUser} an admin`;

    case 'admin_revoke':
      return `${actor} removed admin rights from ${targetUser}`;

    case 'settings_update':
      return `Group settings were updated`;

    default:
      return ''; // Unknown event type
  }
}
