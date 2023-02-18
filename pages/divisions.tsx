import * as React from 'react';
import { List, Card, Typography, Button } from 'antd';
import { useQuery, gql } from '@apollo/client';
import ReactToPrint from 'react-to-print';

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

const PrintWrapper = React.forwardRef((props: any, ref: any) => {
    return (
        <div ref={ref}>{props.children}</div>
    );
});

PrintWrapper.displayName = 'PrintWrapper'

export default function DivisionsPage() {

    var printRef = React.useRef();
    const { data, loading, error } = useQuery(DIVISION_PAGINATION);

    const count = data?.academyPagination?.items?.reduce((t: any, academy: any) => {

        t += academy.participants.length;
        return t;

    }, 0);

    return (

        <PrintWrapper ref={printRef}>

            <List

                header={(
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ marginLeft: 20 }}>Athlete List By Division : {count && count}</span>

                        <ReactToPrint
                            trigger={() => {
                                // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                                // to the root node of the returned component as it will be overwritten.
                                return <Button style={{
                                    marginRight: 20
                                }} type={'primary'}>Print</Button>
                            }}
                            content={() => printRef?.current as any}
                        />

                    </div>
                )}
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

                            const p = { ...participant };
                            p.academy = academy;
                            const [_id, weight] = p?.weight.split('/');

                            if (_id == category._id) {

                                if (accumulator[weight]) {
                                    accumulator[weight].push(p);
                                } else {
                                    accumulator[weight] = [p];
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

                                                    {i + 1}. <Typography.Text mark>{participant.name}</Typography.Text> ({participant.academy.name})

                                                </List.Item>
                                            )} />
                                    )
                                })}

                            </Card>
                        </List.Item>
                    )
                }}
            />
        </PrintWrapper>

    )
}