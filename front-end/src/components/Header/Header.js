import React from 'react';

import {
    Header,
    HeaderName,
    HeaderNavigation,
    HeaderMenuItem,
    HeaderGlobalBar,
    HeaderGlobalAction,
    SkipToContent,
} from 'carbon-components-react';

import {
    AppSwitcher20,
    Notification20,
    UserAvatar20,
} from '@carbon/icons-react';

const AppHeader = () => (
    <Header aria-label="Corona Scare Level">
        <SkipToContent />
        <HeaderName href="/" prefix="Corona">
            Scare Level
        </HeaderName>
        <HeaderNavigation aria-label="Scare Level">
            <HeaderMenuItem href="/">Dashboard</HeaderMenuItem>
            <HeaderMenuItem href="/about">About</HeaderMenuItem>
        </HeaderNavigation>

        <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="Notifications">
                <Notification20 />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="User Avatar">
                <UserAvatar20 />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="App Switcher">
                <AppSwitcher20 />
            </HeaderGlobalAction>
        </HeaderGlobalBar>

    </Header>
);
export default AppHeader;