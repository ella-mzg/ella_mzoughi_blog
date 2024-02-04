export const canEdit = (session, resource) =>
  session && session.user && session.user.id === resource.author?.id
