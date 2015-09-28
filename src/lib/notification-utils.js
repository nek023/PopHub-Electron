export function notificationHtmlUrl(notification) {
  const urlObject = new URL(notification.subject.url);
  const pathComponents = urlObject.pathname.split('/');
  const htmlUrl = notification.repository.html_url;

  switch (notification.subject.type) {
  case 'Commit':
    const commitSha = pathComponents[pathComponents.length - 1];
    return `${htmlUrl}/commit/${commitSha}`;

  case 'Issue':
    const issueId = pathComponents[pathComponents.length - 1];
    return `${htmlUrl}/issues/${issueId}`;

  case 'PullRequest':
    const pullRequestId = pathComponents[pathComponents.length - 1];
    return `${htmlUrl}/pull/${pullRequestId}`;

  case 'Release':
    const tag = notification.subject.title.split(':')[0];
    return `${htmlUrl}/tag/${tag}`;

  default:
    return htmlUrl;
  }
}
