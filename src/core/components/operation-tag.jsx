import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"
import { createDeepLinkPath, sanitizeUrl } from "core/utils"

export default class OperationTag extends React.Component {

  static defaultProps = {
    tagObj: Im.fromJS({}),
    tag: "",
  }

  static propTypes = {
    tagObj: ImPropTypes.map.isRequired,
    tag: PropTypes.string.isRequired,

    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,

    getConfigs: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,

    children: PropTypes.element,
  }

  render() {
    const {
      tagObj,
      tag,
      children,

      layoutSelectors,
      layoutActions,
      getConfigs,
      getComponent,
    } = this.props

    let {
      docExpansion,
      deepLinking,
    } = getConfigs()

    const isDeepLinkingEnabled = deepLinking && deepLinking !== "false"

    const Collapse = getComponent("Collapse")
    const Markdown = getComponent("Markdown")
    const DeepLink = getComponent("DeepLink")
    const Link = getComponent("Link")

    let tagDescription = tagObj.getIn(["tagDetails", "description"], null)
    let tagExternalDocsDescription = tagObj.getIn(["tagDetails", "externalDocs", "description"])
    let tagExternalDocsUrl = tagObj.getIn(["tagDetails", "externalDocs", "url"])

    let isShownKey = ["operations-tag", createDeepLinkPath(tag)]
    let showTag = layoutSelectors.isShown(isShownKey, docExpansion === "full" || docExpansion === "list")

    return (
      <div className={showTag ? "opblock-tag-section is-open" : "opblock-tag-section"} >

        <h2><div role="button"
          tabIndex={0}
          onKeyDown={(event) => {event.keyCode === 13 ? layoutActions.show(isShownKey, !showTag) : null }}
          onClick={() => layoutActions.show(isShownKey, !showTag)}
          className={!tagDescription ? "opblock-tag no-desc" : "opblock-tag" }
          id={isShownKey.join("-")}>
          <DeepLink
            enabled={isDeepLinkingEnabled}
            isShown={showTag}
            path={tag}
            text={tag} />
          { !tagDescription ? <small></small> :
            <small>
                <Markdown source={tagDescription} />
              </small>
            }

            <div>
              { !tagExternalDocsDescription ? null :
                <small>
                    { tagExternalDocsDescription }
                      { tagExternalDocsUrl ? ": " : null }
                      { tagExternalDocsUrl ?
                        <Link
                            href={sanitizeUrl(tagExternalDocsUrl)}
                            
                            target="_blank"
                            >{tagExternalDocsUrl}</Link> : null
                          }
                  </small>
                }
            </div>

            <div
              className="expand-operation"
              title={showTag ? "Collapse operation": "Expand operation"}
              >

              <svg className="arrow" width="20" height="20" role="img" aria-label={showTag ? "large arrow down" : "large arrow"}>
                <title>{showTag ? "large arrow down" : "large arrow"}</title>
                <use href={showTag ? "#large-arrow-down" : "#large-arrow"} xlinkHref={showTag ? "#large-arrow-down" : "#large-arrow"} />
              </svg>
            </div>
            </div>
        </h2 >

        <Collapse isOpened={showTag}>
          {children}
        </Collapse>
      </div>
    )
  }
}
