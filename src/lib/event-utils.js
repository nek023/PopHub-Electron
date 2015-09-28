import React from 'react';

export function octiconClassNameForEvent(event) {
  switch (event.type) {
  case 'CommitCommentEvent':
    return 'octicon-comment-discussion';

  case 'CreateEvent':
    switch (event.payload.ref_type) {
    case 'repository':
      return 'octicon-repo';

    case 'branch':
      return 'octicon-git-branch';

    case 'tag':
      return 'octicon-tag';

    default:
      return '';
    }

  case 'DeleteEvent':
    switch (event.payload.ref_type) {
    case 'branch':
      return 'octicon-git-branch';

    case 'tag':
      return 'octicon-tag';

    default:
      return '';
    }

  case 'DeploymentEvent':
    return '';

  case 'DeploymentStatusEvent':
    return '';

  case 'DownloadEvent':
    return '';

  case 'FollowEvent':
    return '';

  case 'ForkApplyEvent':
    return '';

  case 'ForkEvent':
    return 'octicon-git-branch';

  case 'GistEvent':
    return '';

  case 'GollumEvent':
    return 'octicon-book';

  case 'IssueCommentEvent':
    return 'octicon-comment-discussion';

  case 'IssuesEvent':
    switch (event.payload.action) {
    case 'assigned':
      return '';

    case 'unassigned':
      return '';

    case 'labeled':
      return '';

    case 'unlabeled':
      return '';

    case 'closed':
      return 'octicon-issue-closed';

    case 'opened':
      return 'octicon-issue-opened';

    case 'reopened':
      return 'octicon-issue-reopened';

    default:
      return '';
    }

  case 'MemberEvent':
    return '';

  case 'PageBuildEvent':
    return '';

  case 'PublicEvent':
    return 'octicon-repo';

  case 'PullRequestEvent':
    return 'octicon-git-pull-request';

  case 'PullRequestReviewCommentEvent':
    return 'octicon-comment-discussion';

  case 'PushEvent':
    return 'octicon-git-commit';

  case 'ReleaseEvent':
    return '';

  case 'StatusEvent':
    return '';

  case 'TeamAddEvent':
    return '';

  case 'WatchEvent':
    return 'octicon-star';

  default:
    return '';
  }
}

export function titleForEvent(event) {
  const actorName = event.actor.login;
  const repositoryName = event.repo.name;

  switch (event.type) {
  case 'CommitCommentEvent': {
    const commitId = event.payload.comment.commit_id;
    const commitName = `${repositoryName}@${commitId.substring(0, 10)}`;

    return `${actorName} commented on commit ${commitName}`;
  }

  case 'CreateEvent': {
    const refName = event.payload.ref;

    switch (event.payload.ref_type) {
    case 'repository':
      return `${actorName} created repository ${repositoryName}`;

    case 'branch':
      return `${actorName} created branch ${refName} at ${repositoryName}`;

    case 'tag':
      return `${actorName} created tag ${refName} at ${repositoryName}`;

    default:
      return '';
    }
  }

  case 'DeleteEvent': {
    const refType = event.payload.ref_type;
    const refName = event.payload.ref;

    return `${actorName} deleted ${refType} ${refName} at ${repositoryName}`;
  }

  case 'DeploymentEvent':
    return '';

  case 'DeploymentStatusEvent':
    return '';

  case 'DownloadEvent':
    return '';

  case 'FollowEvent':
    return '';

  case 'ForkApplyEvent':
    return '';

  case 'ForkEvent': {
    const forkeeName = event.payload.forkee.full_name;

    return `${actorName} forked ${repositoryName} to ${forkeeName}`;
  }

  case 'GistEvent':
    return '';

  case 'GollumEvent': {
    const pages = event.payload.pages;

    if (pages.length === 0) return '';

    const page = pages[0];
    return `${actorName} ${page.action} the ${repositoryName} wiki`;
  }

  case 'IssueCommentEvent': {
    const issueNumber = event.payload.issue.number;
    const issueName = `${repositoryName}#${issueNumber}`;
    const isPullRequest = (event.payload.issue.pull_request !== undefined);

    if (isPullRequest) {
      return `${actorName} commented on pull request ${issueName}`;
    } else {
      return `${actorName} commented on issue ${issueName}`;
    }
  }

  case 'IssuesEvent': {
    const issueNumber = event.payload.issue.number;
    const issueName = `${repositoryName}#${issueNumber}`;

    switch (event.payload.action) {
    case 'assigned':
      return '';

    case 'unassigned':
      return '';

    case 'labeled':
      return '';

    case 'unlabeled':
      return '';

    case 'closed':
      return `${actorName} closed issue ${issueName}`;

    case 'opened':
      return `${actorName} opened issue ${issueName}`;

    case 'reopened':
      return `${actorName} reopened issue ${issueName}`;

    default:
      return '';
    }
  }

  case 'MemberEvent': {
    const memberName = event.payload.member.login;

    return `${actorName} added ${memberName} to ${repositoryName}`;
  }

  case 'PageBuildEvent':
    return '';

  case 'PublicEvent':
    return `${actorName} open sourced ${repositoryName}`;

  case 'PullRequestEvent': {
    const pullRequestNumber = event.payload.number;
    const pullRequestName = `${repositoryName}#${pullRequestNumber}`;

    switch (event.payload.action) {
    case 'opened':
      return `${actorName} opened pull request ${pullRequestName}`;

    case 'closed':
      const isMerged = (event.payload.pull_request.merged === 'true');
      const closeAction = isMerged ? 'merged' : 'closed';

      return `${actorName} ${closeAction} pull request ${pullRequestName}`;

    default:
      return '';
    }
  }

  case 'PullRequestReviewCommentEvent': {
    const pullRequestNumber = event.payload.number;
    const pullRequestName = `${repositoryName}#${pullRequestNumber}`;

    return `${actorName} commented on pull request ${pullRequestName}`;
  }

  case 'PushEvent': {
    const refComponents = event.payload.ref.split('/');
    const branchName = refComponents[refComponents.length - 1];
    const branchURL = `https://github.com/${repositoryName}/tree/${branchName}`;

    return `${actorName} pushed to ${branchName} at ${repositoryName}`;
  }

  case 'ReleaseEvent':
    return '';

  case 'StatusEvent':
    return '';

  case 'TeamAddEvent':
    return '';

  case 'WatchEvent':
    return `${actorName} starred ${repositoryName}`;

  default:
    return '';
  }
}

export function titleElementForEvent(event, onLinkClick) {
  const actorName = event.actor.login;
  const actorURL = `https://github.com/${actorName}`;
  const repositoryName = event.repo.name;
  const repositoryURL = `https://github.com/${repositoryName}`;

  switch (event.type) {
  case 'CommitCommentEvent': {
    const commitId = event.payload.comment.commit_id;
    const commitName = `${repositoryName}@${commitId.substring(0, 10)}`;
    const commitCommentURL = event.payload.comment.html_url;

    return (
      <div>
        <a href="#" onClick="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
        {' commented on commit '}
        <a href="#" onClick={onLinkClick.bind(this, commitCommentURL)}>{commitName}</a>
      </div>
    );
  }

  case 'CreateEvent': {
    const refName = event.payload.ref;
    const refURL = `https://github.com/${repositoryName}/tree/${refName}`;

    switch (event.payload.ref_type) {
    case 'repository':
      return (
        <div>
          <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
          {' created repository '}
          <a href="#" onClick={onLinkClick.bind(this, repositoryURL)}>{repositoryName}</a>
        </div>
      );

    case 'branch':
      return (
        <div>
          <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
          {' created branch '}
          <a href="#" onClick={onLinkClick.bind(this, refURL)}>{refName}</a>
          {' at '}
          <a href="#" onClick={onLinkClick.bind(this, repositoryURL)}>{repositoryName}</a>
        </div>
      );

    case 'tag':
      return (
        <div>
          <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
          {' created tag '}
          <a href="#" onClick={onLinkClick.bind(this, refURL)}>{refName}</a>
          {' at '}
          <a href="#" onClick={onLinkClick.bind(this, repositoryURL)}>{repositoryName}</a>
        </div>
      );

    default:
      return (<div></div>);
    }
  }

  case 'DeleteEvent': {
    const refType = event.payload.ref_type;
    const refName = event.payload.ref;

    return (
      <div>
        <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
        {' deleted '}
        {refType}
        {' '}
        {refName}
        {' at '}
        <a href="#" onClick={onLinkClick.bind(this, repositoryURL)}>{repositoryName}</a>
      </div>
    );
  }

  case 'DeploymentEvent':
    return (<div></div>);

  case 'DeploymentStatusEvent':
    return (<div></div>);

  case 'DownloadEvent':
    return (<div></div>);

  case 'FollowEvent':
    return (<div></div>);

  case 'ForkApplyEvent':
    return (<div></div>);

  case 'ForkEvent': {
    const forkeeName = event.payload.forkee.full_name;
    const forkeeURL = `https://github.com/${forkeeName}`;

    return (
      <div>
        <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
        {' forked '}
        <a href="#" onClick={onLinkClick.bind(this, repositoryURL)}>{repositoryName}</a>
        {' to '}
        <a href="#" onClick={onLinkClick.bind(this, forkeeURL)}>{forkeeName}</a>
      </div>
    );
  }

  case 'GistEvent':
    return (<div></div>);

  case 'GollumEvent': {
    const pages = event.payload.pages;

    if (pages.length > 0) {
      const page = pages[0];

      return (
        <div>
          <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
          {' '}
          {page.action}
          {' the '}
          <a href="#" onClick={onLinkClick.bind(this, repositoryURL)}>{repositoryName}</a>
          {' wiki'}
        </div>
      );
    }

    return (<div></div>);
  }

  case 'IssueCommentEvent': {
    const issueNumber = event.payload.issue.number;
    const issueName = `${repositoryName}#${issueNumber}`;
    const issueURL = event.payload.issue.html_url;
    const isPullRequest = (event.payload.issue.pull_request !== undefined);

    if (isPullRequest) {
      return (
        <div>
          <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
          {' commented on pull request '}
          <a href="#" onClick={onLinkClick.bind(this, issueURL)}>{issueName}</a>
        </div>
      );
    } else {
      return (
        <div>
          <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
          {' commented on issue '}
          <a href="#" onClick={onLinkClick.bind(this, issueURL)}>{issueName}</a>
        </div>
      );
    }
  }

  case 'IssuesEvent': {
    const issueNumber = event.payload.issue.number;
    const issueName = `${repositoryName}#${issueNumber}`;
    const issueURL = event.payload.issue.html_url;

    switch (event.payload.action) {
    case 'assigned':
      return (<div></div>);

    case 'unassigned':
      return (<div></div>);

    case 'labeled':
      return (<div></div>);

    case 'unlabeled':
      return (<div></div>);

    case 'closed':
      return (
        <div>
          <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
          {' closed issue '}
          <a href="#" onClick={onLinkClick.bind(this, issueURL)}>{issueName}</a>
        </div>
      );

    case 'opened':
      return (
        <div>
          <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
          {' opened issue '}
          <a href="#" onClick={onLinkClick.bind(this, issueURL)}>{issueName}</a>
        </div>
      );

    case 'reopened':
      return (
        <div>
          <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
          {' reopened issue '}
          <a href="#" onClick={onLinkClick.bind(this, issueURL)}>{issueName}</a>
        </div>
      );

    default:
      return (<div></div>);
    }
  }

  case 'MemberEvent': {
    const memberName = event.payload.member.login;
    const memberURL = `https://github.com/${memberName}`;

    return (
      <div>
        <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
        {' added '}
        <a href="#" onClick={onLinkClick.bind(this, memberURL)}>{memberName}</a>
        {' to '}
        <a href="#" onClick={onLinkClick.bind(this, repositoryURL)}>{repositoryName}</a>
      </div>
    );
  }

  case 'PageBuildEvent':
    return (<div></div>);

  case 'PublicEvent':
    return (
      <div>
        <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
        {' open sourced '}
        <a href="#" onClick={onLinkClick.bind(this, repositoryURL)}>{repositoryName}</a>
      </div>
    );

  case 'PullRequestEvent': {
    const pullRequestNumber = event.payload.number;
    const pullRequestName = `${repositoryName}#${pullRequestNumber}`;
    const pullRequestURL = `https://github.com/${repositoryName}/pull/${pullRequestNumber}`;

    switch (event.payload.action) {
    case 'opened':
      return (
        <div>
          <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
          {' opened pull request '}
          <a href="#" onClick={onLinkClick.bind(this, pullRequestURL)}>{pullRequestName}</a>
        </div>
      );

    case 'closed':
      const isMerged = (event.payload.pull_request.merged === 'true');
      const closeAction = isMerged ? 'merged' : 'closed';

      return (
        <div>
          <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
          {' '}
          {closeAction}
          {' pull request '}
          <a href="#" onClick={onLinkClick.bind(this, pullRequestURL)}>{pullRequestName}</a>
        </div>
      );

    default:
      return (<div></div>);
    }
  }

  case 'PullRequestReviewCommentEvent': {
    const pullRequestNumber = event.payload.number;
    const pullRequestName = `${repositoryName}#${pullRequestNumber}`;
    const pullRequestURL = `https://github.com/${repositoryName}/pull/${pullRequestNumber}`;

    return (
      <div>
        <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
        {' commented on pull request '}
        <a href="#" onClick={onLinkClick.bind(this, pullRequestURL)}>{pullRequestName}</a>
      </div>
    );
  }

  case 'PushEvent': {
    const refComponents = event.payload.ref.split('/');
    const branchName = refComponents[refComponents.length - 1];
    const branchURL = `https://github.com/${repositoryName}/tree/${branchName}`;

    return (
      <div>
        <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
        {' pushed to '}
        <a href="#" onClick={onLinkClick.bind(this, branchURL)}>{branchName}</a>
        {' at '}
        <a href="#" onClick={onLinkClick.bind(this, repositoryURL)}>{repositoryName}</a>
      </div>
    );
  }

  case 'ReleaseEvent':
    return (<div></div>);

  case 'StatusEvent':
    return (<div></div>);

  case 'TeamAddEvent':
    return (<div></div>);

  case 'WatchEvent':
    return (
      <div>
        <a href="#" onClick={onLinkClick.bind(this, actorURL)}>{actorName}</a>
        {' starred '}
        <a href="#" onClick={onLinkClick.bind(this, repositoryURL)}>{repositoryName}</a>
      </div>
    );

  default:
    return (<div></div>);
  }
}
