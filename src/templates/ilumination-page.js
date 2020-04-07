import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Searcher from '../components/searcher'
import CategoriesMenu from '../components/categoriesMenu'
import Renewable from '../components/renewable'

export default class IluminationPageTemplate extends React.Component {

    constructor(props) {
        super(props)
        this.getProducts = this.getProducts.bind(this)
        this.solarSection = this.solarSection.bind(this)
        this.renewableSection = this.renewableSection.bind(this)
        this.state = {
            onSearch: false,
            activeCategory: '',
            products: [],
            subcategories: [],
            renderIluminationType: false,
            renderRenewable: false,
            
        }
    }

    solarSection() {
        
        this.setState({
            renderIluminationType: true,
            renderRenewable: false,
        })
        
    }

    renewableSection() {
        this.setState({
            renderIluminationType: false,
            renderRenewable: true,
        })
    }

    getProducts = async () => {
        if( Object.keys(this.state.products).length === 0 ) {
            this.products = await import('../../public/products.json')
        } else {
            console.log('Productos previamente importados')
        }
        if( Object.keys(this.state.subcategories).length === 0 ) {
            this.subcategories = await import('../../public/subcategories.json')
        } else {
            console.log('Subcategorias previamente importadas')
        }
        this.setState({
            products: this.products,
            subcategories: this.subcategories,
        })
    }

    render() {
        const data = this.props.data,
              path = this.props.path,
              products = this.state.products.default,
              subcategories = this.state.subcategories.default
            
        let iluminationTypeWillRender = this.state.renderIluminationType,
            renewableWillRender = this.state.renderRenewable
        
        if(path === '/iluminacion-led/'){
            iluminationTypeWillRender = true
            renewableWillRender = false
        }
        
        return (
            <Layout>
                {path === '/iluminacion-led-solar/'?
                    <>
                        <div className="d-flex menu-solar-container">
                            <a 
                                href="#solar"
                                className="menu-solar menu-solar-cover"
                                style={{
                                    backgroundImage: `url(${data.solar.childImageSharp.fluid.src})`,
                                }}
                            >
                                <div onClick={this.solarSection} className="menu-solar-content">
                                    <h2 className="menu-solar-title">Iluminación Solar</h2>
                                </div>   
                            </a>
                            <a 
                                href="#renewable"
                                className="menu-solar-cover"
                                style={{
                                    backgroundImage: `url(${data.renovables.childImageSharp.fluid.src})`,
                                }}
                            >
                                <div onClick={this.renewableSection} className="menu-solar-content">
                                    <h2 className="menu-solar-title">Energías Renovables</h2>
                                </div>
                            </a>
                        </div>
                        {iluminationTypeWillRender?
                            <div id="solar">
                                <Searcher
                                    willRender={iluminationTypeWillRender}
                                    getProducts={this.getProducts} 
                                    products={products}
                                />
                                <div className="container">
                                    <CategoriesMenu 
                                        willRender={iluminationTypeWillRender}
                                        data={data} 
                                        path={path} 
                                        getProducts={this.getProducts} 
                                        products={products} 
                                        subcategories={subcategories} 
                                    />
                                    
                                </div>
                            </div>
                            : <Renewable willRender={renewableWillRender}/>
                        }
                    </>
                    :
                    <>
                        <Searcher
                            willRender={iluminationTypeWillRender}
                            getProducts={this.getProducts} 
                            products={products}
                        />
                        <div className="container mb-5">
                            <CategoriesMenu 
                                willRender={iluminationTypeWillRender}
                                data={data} 
                                path={path} 
                                getProducts={this.getProducts} 
                                products={products} 
                                subcategories={subcategories} 
                            />
                            
                        </div>
                    </>
                } 
                
            </Layout>
        )
    }
}

/*IluminationPage.propTypes = {
    data: PropTypes.shape({
        categoryByIluminationType: PropTypes.shape({
            edges: PropTypes.array,
        }),
        products: PropTypes.shape({
            edges: PropTypes.array,
        })
    }),
}*/

export const IluminationPageQuery = graphql`
    query IluminationPage($iluminationType: String!){
        categoryByIluminationType: allMarkdownRemark(filter: {frontmatter: {type: {eq: "category"} iluminationType: {eq: $iluminationType }}}, sort: {order: ASC, fields: frontmatter___title}){
            edges {
                node {
                    frontmatter {
                        title
                        image {
                            childImageSharp {
                                fluid(quality: 100, maxWidth: 1200){
                                    ...GatsbyImageSharpFluid
                                }
                            }
                        }
                        type
                    }
                }
            }
        }
        renovables: file(relativePath: {eq: "energias-renovables.jpg"}) {
            childImageSharp {
                fluid(maxWidth: 1024, quality:100) {
                    ...GatsbyImageSharpFluid
                }
            }
        }
        solar: file(relativePath: {eq: "iluminacion-solar.jpg"}) {
            childImageSharp {
                fluid(maxWidth: 1024, quality:100) {
                    ...GatsbyImageSharpFluid
                }
            }
        }
    }
`