import * as React from 'react';
import { List, Card, Typography } from 'antd';
import { useQuery, gql } from '@apollo/client';

const DIVISION_PAGINATION = gql`

  query {
    academyPagination(page: 1, perPage: 20, filter: {}, sort: _ID_ASC) {
      count
      items {
        name
        trainer
        email
        phone
        participants {
          name
          weight
        }
        _id
      }
      pageInfo {
        currentPage
        perPage
        pageCount
        itemCount
        hasNextPage
        hasPreviousPage
      }
    }

    categoryPagination(page: 1, perPage: 20, filter: {}, sort: _ID_ASC) {
        count
        items {
          name
          _id
        }
        pageInfo {
          currentPage
          perPage
          pageCount
          itemCount
          hasNextPage
          hasPreviousPage
        }
      }
  }

`

export default function DivisionsPage() {

    const { data, loading, error } = useQuery(DIVISION_PAGINATION);

    const count = data?.academyPagination?.pageInfo?.itemCount;

    return (
        <List
            header={count && `Athlete List By Division : ${count}`}
            loading={loading}
            grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 3,
            }}
            dataSource={data?.categoryPagination?.items}
            renderItem={(category: any) => {

                const academies = data?.academyPagination?.items;

                const weights = academies.reduce((accumulator: any, academy: any) => {

                    academy.participants.forEach((participant: any) => {

                        const [_id, weight] = participant?.weight.split('/');

                        if (_id == category._id) {

                            if (accumulator[weight]) {
                                accumulator[weight].push(participant);
                            } else {
                                accumulator[weight] = [participant];
                            }
                        }

                    });

                    return accumulator;

                }, {})

                return (
                    <List.Item>
                        <Card title={category.name}>

                            {Object.keys(weights).map((weight: any, i: number) => {
                                return (
                                    <List
                                        key={i}
                                        bordered
                                        header={`${weight} kg`}
                                        dataSource={weights[weight]}
                                        renderItem={(participant: any, i: number) => (
                                            <List.Item>
                                                {i + 1}. <Typography.Text mark>{participant.name}</Typography.Text>
                                            </List.Item>
                                        )} />
                                )
                            })}

                        </Card>
                    </List.Item>
                )
            }}
        />
    )
}