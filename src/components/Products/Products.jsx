import React from 'react';
import { Grid } from '@material-ui/core';

import Product from './Product/Product';
import useStyles from './styles';

const products = [
    {id: 1, name: 'Shoes', description: 'Running shoes', price: '$5', image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/f9b52c1f-ca36-4492-8836-7a84c6bfd789/quest-3-running-shoe-tHzGtw.png'},
    {id: 2, name: 'MacBook', description: 'Apple MacBook', price: '$10', image: 'https://www.links.hr/content/images/thumbs/009/0093583_prijenosno-racunalo-apple-macbook-air-13-3-retina-mgn63cr-a-octacore-apple-m1-8gb-256gb-ssd-apple-g.jpg'},

]

const Products = () => {
    const classes = useStyles();

    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container justify="center" spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <Product product={product} />
                    </Grid>
                ))}
            </Grid>
        </main>
    )

}

export default Products;