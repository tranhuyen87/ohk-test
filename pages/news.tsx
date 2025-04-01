import {
  Box,
  Card,
  CardActionArea,
  Grid,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useRequireAuth from '../lib/use-require-auth';

type Topic = {
  topics_id: string;
  subject: string;
  inst_ymdhi: string;
  ext_8: {
    url: string;
  };
};

const News = () => {
  const isLoggedIn = useRequireAuth();
  const router = useRouter();
  const [items, setItems] = useState<Topic[]>();
  const [pageCount, setPageCount] = useState<number>();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    fetch(
      ((process.env.NEXT_PUBLIC_BASE_URL +
        '/rcms-api/1/content/list?pageID=' +
        (router.query.page || '1')) as string),
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.errors.length) {
          return;
        }
        setItems(data.list);
        setPageCount(data.pageInfo.totalPageCnt);
      });
  }, [isLoggedIn, router.query]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h1">
        News
      </Typography>

      <Box>
        <Grid container spacing={3}>
          {items?.map((item) => (
            <Grid key={item.topics_id} item xs={4}>
              <Card>
                <Link href={`/news/${item.topics_id}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="194"
                      image={item.ext_8.url}
                      alt=""
                    />
                    <Box
                      sx={{
                        p: 2,
                      }}
                    >
                      <Typography>{item.subject}</Typography>
                      <Typography>
                        {format(new Date(item.inst_ymdhi), 'yyyy/MM/dd')}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Pagination
        onChange={(_, page) =>
          router.push({
            pathname: router.pathname,
            query: {
              page,
            },
          })
        }
        count={pageCount}
      />
    </Stack>
  );
};

export default News;