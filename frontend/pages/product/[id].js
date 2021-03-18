import SingleProduct from '../../components/SingleProduct';

export default function ProductId ({ query }) {
    return <SingleProduct id={query.id}></SingleProduct>
}