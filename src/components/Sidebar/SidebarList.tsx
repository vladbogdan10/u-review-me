import * as React from 'react';
import Link from '@material-ui/core/Link';
import NextLink from 'next/link';
import { PostType } from '../../types/types';

const SidebarList = (props: PostType) => {
  return (
    <li>
      <article>
        <NextLink
          href={`/${props.category}/${props.subcategory}/${props.urlId}/${props.slug}`}
          prefetch={false}
          passHref
        >
          <Link color="textPrimary" variant="body1">
            {props.title}
          </Link>
        </NextLink>
      </article>
    </li>
  );
};

export default SidebarList;
