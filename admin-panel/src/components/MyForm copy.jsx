import { useEffect, useState, useRef, useMemo } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Col, Form, Row, Table } from "react-bootstrap";
import { DAYS } from "../constant/fromConfig";
import Select from "react-select";
import JoditEditor from "jodit-react";
// import Dropzone from "react-dropzone";
const env = import.meta.env
const days = DAYS;

const MyForm = ({
  errors,
  fields,
  initialValues,
  validSchema,
  onSubmit = () => null,
  isReset = false,
  disabled = false,
}) => {
  const [inactive, setInActive] = useState(false);
  const [showTable, setShowTable] = useState(false);
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validSchema}
      onSubmit={(values, { resetForm }) => {
        if (!disabled) {
          onSubmit(values);
          isReset && resetForm();
          setInActive(true);
          setTimeout(() => {
            setInActive(false);
          }, 2000);
        }
      }}
    >
      {({ values, setFieldValue, errors }) => {
        return (
          <FormikForm autoComplete="off">
            <Row>
              <Col md={12}>
                {errors && errors?.id && (
                  <div
                    className="alert alert-danger py-2 fs--1 mb-0 d-flex"
                    role="alert"
                  >
                    <i className="fa-solid fa-exclamation"></i>{" "}
                    {errors && errors?.id}
                    <ErrorMessage name="id" />{" "}
                  </div>
                )}
              </Col>
              {fields?.map(({ isDisabled = false, ...field }, i) => {
                return (
                  <Col md={field?.col ? field?.col : 12} key={i}>
                    {field?.type === "line" ? (
                      <>
                        <hr />{" "}
                        <h6 style={{ color: "rgb(78 83 90)" }} className="fs-1">
                          {field?.label}
                        </h6>{" "}
                      </>
                    ) : (
                      <Form.Group className="my-2">
                        {!["submit", "file", "hidden"].includes(
                          field?.type
                        ) && (
                            <Form.Label className="form-label">
                              {field?.label}
                            </Form.Label>
                          )}
                        {(() => {
                          delete field?.hideLabel;

                          switch (field?.type) {
                            // For Select Input
                            case "select":
                              var field2 = Object.assign({}, field);
                              delete field2.options;
                              return (
                                <Field
                                  disabled={disabled || isDisabled}
                                  className="form-select"
                                  {...field2}
                                  name={field?.name}
                                  as="select"
                                >
                                  <option value="0" disabled>
                                    Select {field?.label}
                                  </option>
                                  {field?.options.map((option, i) => (
                                    <option value={option?.id} key={option?.id}>
                                      {option?.name}
                                    </option>
                                  ))}
                                </Field>
                              );

                            // For Select Input
                            case "select2":
                              return (
                                <Field
                                  disabled={disabled || isDisabled}
                                  {...field}
                                  options={field?.options}
                                  component={Select2}
                                />
                              );

                            // For Select Input
                            case "select-multiple":
                              return (
                                <Field
                                  disabled={disabled || isDisabled}
                                  isMulti={true}
                                  {...field}
                                  options={field?.options}
                                  component={SelectMultiple}
                                />
                              );

                            // For Textarea Input
                            case "textarea":
                              return (
                                <Field
                                  disabled={disabled || isDisabled}
                                  className="form-control"
                                  placeholder={field?.label}
                                  as="textarea"
                                  {...field}
                                />
                              );

                            // For Html Editor Input
                            case "text-editer":
                              return (
                                <Field
                                  disabled={disabled || isDisabled}
                                  name={field?.name}
                                  component={TextEditer}
                                  {...field}
                                />
                              );

                            // For File Input
                            case "file":
                              return (
                                <Field
                                  disabled={disabled || isDisabled}
                                  name={field?.name}
                                  component={PictureInput}
                                  {...field}
                                />
                              );

                            case "multi-file":
                              return (
                                <Field
                                  disabled={disabled || isDisabled}
                                  name={field?.name}
                                  multiple
                                  component={PictureInputPreview}
                                  {...field}
                                />
                              );

                            // case 'multi-file-data':
                            //     return <Field disabled={disabled || isDisabled} name={field?.name} multiple component={MultiFileUpload} {...field} />;

                            case "check":
                              return (
                                <Field
                                  disabled={disabled || isDisabled}
                                  type="checkbox"
                                  name={field?.name}
                                  label={field?.name}
                                  component={Checkbox}
                                />
                              );
                            // For Read Only Input
                            case "readOnly":
                              return (
                                <div>
                                  <Field
                                    disabled={disabled || isDisabled}
                                    type="text"
                                    name={field?.name}
                                    value={field?.value}
                                    readOnly
                                    className="form-control"
                                  />
                                  <Field
                                    type="hidden"
                                    name={field?.name}
                                    value={field?.hiddenValue}
                                  />
                                </div>
                              );

                            case "opening_hr":
                              return (
                                <>
                                  <Col md={12} className="mb-3">
                                    <div className="d-flex gap-3">
                                      <label className="d-flex align-items-center">
                                        <Field
                                          type="checkbox"
                                          name="hour_type"
                                          className="me-2"
                                          checked={values.hour_type === true}
                                          onChange={() => {
                                            setFieldValue("hour_type", true);
                                            setShowTable(true);
                                          }}
                                        />
                                        Selected Hours
                                      </label>
                                      <label className="d-flex align-items-center">
                                        <Field
                                          type="checkbox"
                                          name="hour_type"
                                          className="me-2"
                                          checked={values.hour_type === false}
                                          onChange={() => {
                                            setFieldValue("hour_type", false);
                                            setShowTable(false);
                                          }}
                                        />
                                        Always Open {values.hour_type}
                                      </label>
                                    </div>
                                  </Col>

                                  {(showTable || values.hour_type == true) && (
                                    <Table striped bordered hover>
                                      <thead>
                                        <tr>
                                          <th>Day</th>
                                          <th>Opening Time</th>
                                          <th>Closing Time</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {days?.map((day, index) => (
                                          <tr key={index}>
                                            <td>
                                              <label className="d-flex align-items-center">
                                                <Field
                                                  type="checkbox"
                                                  name={`opening_hours.${day}.enabled`}
                                                  checked={
                                                    values?.opening_hours[day]
                                                      ?.enabled
                                                  }
                                                  onChange={(e) =>
                                                    setFieldValue(
                                                      `opening_hours.${day}.enabled`,
                                                      e.target.checked
                                                    )
                                                  }
                                                  className="me-2"
                                                />
                                                {day}
                                              </label>
                                            </td>
                                            <td>
                                              <Field
                                                as="select"
                                                name={`opening_hours.${day}.open`}
                                                className="form-select"
                                                disabled={
                                                  !values?.opening_hours[day]
                                                    ?.enabled
                                                }
                                              >
                                                {Array.from(
                                                  { length: 24 },
                                                  (_, h) => h
                                                ).flatMap((hour) =>
                                                  [
                                                    "00",
                                                    "05",
                                                    "10",
                                                    "15",
                                                    "20",
                                                    "25",
                                                    "30",
                                                    "35",
                                                    "40",
                                                    "45",
                                                    "50",
                                                    "55",
                                                  ].map((minute) => {
                                                    const time = `${hour < 10
                                                      ? `0${hour}`
                                                      : hour
                                                      }:${minute}`;
                                                    return (
                                                      <option
                                                        key={time}
                                                        value={time}
                                                      >
                                                        {time}
                                                      </option>
                                                    );
                                                  })
                                                )}
                                              </Field>
                                            </td>
                                            <td>
                                              <Field
                                                as="select"
                                                name={`opening_hours.${day}.close`}
                                                className="form-select"
                                                disabled={
                                                  !values?.opening_hours[day]
                                                    ?.enabled
                                                }
                                              >
                                                {Array.from(
                                                  { length: 24 },
                                                  (_, h) => h
                                                ).flatMap((hour) =>
                                                  [
                                                    "00",
                                                    "05",
                                                    "10",
                                                    "15",
                                                    "20",
                                                    "25",
                                                    "30",
                                                    "35",
                                                    "40",
                                                    "45",
                                                    "50",
                                                    "55",
                                                  ].map((minute) => {
                                                    const time = `${hour < 10
                                                      ? `0${hour}`
                                                      : hour
                                                      }:${minute}`;
                                                    return (
                                                      <option
                                                        key={time}
                                                        value={time}
                                                      >
                                                        {time}
                                                      </option>
                                                    );
                                                  })
                                                )}
                                              </Field>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  )}
                                </>
                              );

                            // For Submit Input
                            case "submit":
                              return (
                                <button
                                  disabled={disabled || isDisabled || inactive}
                                  value="submit"
                                  className="btn btn-primary"
                                  {...field}
                                >
                                  {field?.label}
                                </button>
                              );

                            case "custom":
                              // Support for custom render function, compatible with dynamic field visibility and label
                              if (typeof field.render === "function") {
                              // Hide field if 'hidden' is true
                              if (field.hidden) return null;
                              return (
                                <>
                                {field.label && (
                                  <Form.Label className="form-label">{field.label}</Form.Label>
                                )}
                                {field.render(values, setFieldValue, field, initialValues)}
                                <ErrorMessage name={field.name} component="div" className="text-danger" />
                                </>
                              );
                              }
                              return null;
                            // case "button-2":
                            //   return (
                            //     <button
                            //       disabled={disabled || isDisabled || inactive}
                            //       type="button"
                            //       value="submit"
                            //       className="btn btn-primary"
                            //       {...field}
                            //     >
                            //       {field?.label}
                            //     </button>
                            //   );

                            case "features":
                              return (
                                <Form.Group className="mb-3">
                                  <FeatureManager
                                    field={field}
                                    values={values}
                                    setFieldValue={setFieldValue}
                                    options={field.options}
                                  />
                                  <ErrorMessage
                                    name={field.name}
                                    component="div"
                                    className="text-danger small"
                                  />
                                </Form.Group>
                              );

                            // For Rest of Input Filed
                            default:
                              return (
                                <Field
                                  disabled={disabled || isDisabled}
                                  className="form-control"
                                  placeholder={field?.label}
                                  {...field}
                                  autoComplete="off"
                                />
                              );
                          }
                        })()}
                        <small className="text-danger">
                          {errors && errors[field?.name]}
                          <ErrorMessage name={field?.name} />
                        </small>
                      </Form.Group>
                    )}
                  </Col>
                );
              })}
            </Row>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

const PictureInput = ({ form, field, multiple, label, disabled }) => {
  var [url, setUrl] = useState("");
  var [urls, setUrls] = useState([]);

  useEffect(() => {
    var data = field?.value;
    if (data != null && Array.isArray(data)) {
      setUrls(data);
    } else if (data != null && typeof data != "object") {
      setUrl(data);
    }
  }, [field]);


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (multiple) {
      form.setFieldValue(field?.name, files);
    } else {
      form.setFieldValue(field?.name, files[0]);
    }
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };
  const [previews, setPreviews] = useState([]);

  return (
    <>
      <label className="form-label form-label">
        {label}
        {![undefined, null, ""].includes(url) && (
          <a className="fs--2 ms-1" target="__blank" href={url}>
            {" "}
            (Download Attachment){" "}
          </a>
        )}
      </label>
      <div className="input-group">
        <input
          name={field?.name}
          className="form-control"
          type="file"
          multiple={multiple}
          disabled={disabled}
          aria-describedby="btnGroupAddon2"
          onChange={handleFileChange}
        />
        {![undefined, null, ""].includes(url) && (
          <a
            className="input-group-text"
            target="__blank"
            href={url}
            id="btnGroupAddon2"
          >
            <i className="fa fa-download"></i>
          </a>
        )}

        {urls.length > 0 && (
          <div className="btn-group me-2" role="group">
            {urls?.map((item, i) => (
              <a
                key={i}
                type="button"
                className="btn btn-secondary"
                href={item}
                target="__blank"
              >
                <i className="fa fa-download"></i>
              </a>
            ))}
          </div>
        )}

      </div>
      {previews.length > 0 && (
        <div className="mt-2">
          {previews.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Preview ${index}`}
              className="img-thumbnail me-2"
              style={{ width: "80px", height: "80px" }}
            />
          ))}
        </div>
      )}
    </>
  );
};

const PictureInputPreview = ({
  form,
  field,
  multiple = false,
  label,
  disabled,
}) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (field?.value && Array.isArray(field?.value)) {
      setPreviews(
        field.value.map((file) =>
          typeof file === "string" ? file : URL.createObjectURL(file)
        )
      );
    }
  }, [field?.value]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (multiple) {
      form.setFieldValue(field?.name, files);
    } else {
      form.setFieldValue(field?.name, files[0]);
    }
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  return (
    <>
      <label className="form-label"></label>
      <input
        name={field?.name}
        className="form-control"
        type="file"
        multiple={multiple}
        disabled={disabled}
        accept="image/*"
        onChange={handleFileChange}
      />
      {previews.length > 0 && (
        <div className="mt-2">
          {previews.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Preview ${index}`}
              className="img-thumbnail me-2"
              style={{ width: "80px", height: "80px" }}
            />
          ))}
        </div>
      )}
    </>
  );
};

const PictureInputSmall = ({
  form,
  field,
  multiple,
  disabled,
  className = "",
}) => {
  var random = Math.random();
  const [selected, setSelected] = useState(false);
  return (
    <>
      <label
        className={`btn btn-sm btn-falcon-default mb-0 ${selected ? className : ""
          }`}
        type="button"
        htmlFor={`random-${random}`}
      >
        <i className="fa fa-paperclip" aria-hidden="true"></i>
      </label>
      <input
        name={field?.name}
        id={`random-${random}`}
        className="form-control d-none"
        type="file"
        multiple={multiple}
        disabled={disabled}
        aria-describedby="btnGroupAddon2"
        onChange={(e) => {
          setSelected(true);
          multiple
            ? form.setFieldValue(field?.name, e.target.files)
            : form.setFieldValue(field?.name, e.target.files[0]);
        }}
      />
    </>
  );
};

const Checkbox = ({
  form,
  field,
  disabled,
  size = "lg",
  onChangeCustom = () => null,
  className = "",
  checked = false,
}) => {
  return (
    <div className={`form-check form-switch form-${size}-switch ${className}`}>
      <input
        checked={checked}
        disabled={disabled}
        className="form-check-input"
        id="Checked"
        type="checkbox"
        {...field}
        onChange={(e) => {
          onChangeCustom(Number(e.target.checked));
          form.setFieldValue(field?.name, Number(e.target.checked));
        }}
      />
      <label className="form-check-label" htmlFor="Checked"></label>
    </div>
  );
};

const Select2 = ({
  form,
  field,
  options = [],
  label = "",
  menuPortalTarget = null,
  className = "",
  classNamePrefix = "react-select",
  disabled = false,
  onChange = () => null,
  onChangeCustom = () => null,
  onBlur = (val) => null,
  onChangeUpdateToNull = false,
}) => {
  const [myValue, setMyValue] = useState(null);
  useEffect(() => {
    if (onChangeUpdateToNull) {
      var selected = options.filter((row) =>
        [row.id, row._id].includes(field?.value)
      );
      selected.length === 1 ? setMyValue(selected?.[0]) : setMyValue(null);
    } else {
      setMyValue(
        options.find((row) => [row.id, row._id].includes(field?.value))
      );
    }
  }, [field?.value, options, onChangeUpdateToNull]);

  return (
    <Select
      closeMenuOnSelect={true}
      options={options}
      isDisabled={disabled}
      menuPortalTarget={menuPortalTarget}
      placeholder={`Select ${label}`}
      // menuIsOpen={false}
      className={className}
      classNamePrefix={classNamePrefix}
      isOptionSelected={(option, selectValue) =>
        selectValue.some((i) => i === option)
      }
      getOptionLabel={(option) => option?.name}
      getOptionValue={(option) => option?.id || option?._id || option?.value}
      value={myValue}
      onBlur={() => {
        onBlur(myValue?.[0]);
      }}
      onChange={(value) => {
        onChange(value);
        onChangeCustom(value);
        setMyValue(value);
        form.setFieldValue(
          field?.name,
          value?.id || value?._id || value?.value
        );
      }}
    />
  );
};

const SelectMultiple = ({
  className,
  placeholder,
  field,
  form,
  disabled = false,
  options,
  isMulti = false,
}) => {
  const onChange = (option) => {
    form.setFieldValue(
      field?.name,
      isMulti ? option.map((item) => item.id) : option.id
    );
  };

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option) => field?.value.indexOf(option?.id) >= 0)
        : options.find((option) => option?.id === field?.value);
    } else {
      return isMulti ? [] : "";
    }
  };

  return (
    <Select
      className={className}
      isDisabled={disabled}
      name={field?.name}
      value={getValue()}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      getOptionLabel={(option) => option?.name}
      getOptionValue={(option) => option?.id}
      isMulti={isMulti}
    />
  );
};



const TextEditer = ({ form, field, disabled }) => {
  const editor = useRef(null);
  const [canUpdate, setCanUpdate] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (canUpdate && field?.value !== "") {
      setContent(field?.value);
      setCanUpdate(false);
    }
  }, [field?.value, canUpdate]);

  return useMemo(() => {
    const config = {
      readonly: disabled,
      activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about', 'dots'],
      saveModeInCookie: false,
      spellcheck: true,
      editorCssClass: false,
      triggerChangeEvent: true,
      width: 'auto',
      height: 'auto',
      minHeight: 100,
      direction: '',
      language: 'auto',
      debugLanguage: false,
      i18n: 'en',
      tabIndex: -1,
      toolbar: true,
      enter: "P",
      useSplitMode: false,
      
      // Configuration to preserve all HTML when pasting
      cleanHTML: {
        fillEmptyParagraph: false,
        replaceNBSP: false,
        removeEmptyElements: false,
        allowTags: false, // Disable tag filtering
      },
      askBeforePasteHTML: false,
      processPaste: function (ev, html) {
        // Return HTML exactly as copied
        return html;
      },

      // Allow ALL HTML tags
      allowTags: {
        // Structural tags
        html: true,
        head: true,
        body: true,
        div: true,
        span: true,
        main: true,
        section: true,
        article: true,
        aside: true,
        header: true,
        footer: true,
        nav: true,
        
        // Text content
        p: true,
        h1: true,
        h2: true,
        h3: true,
        h4: true,
        h5: true,
        h6: true,
        blockquote: true,
        pre: true,
        hr: true,
        br: true,
        
        // Inline text semantics
        a: true,
        strong: true,
        b: true,
        em: true,
        i: true,
        u: true,
        s: true,
        strike: true,
        del: true,
        ins: true,
        mark: true,
        small: true,
        sub: true,
        sup: true,
        code: true,
        kbd: true,
        samp: true,
        var: true,
        time: true,
        
        // Lists
        ul: true,
        ol: true,
        li: true,
        dl: true,
        dt: true,
        dd: true,
        
        // Tables
        table: true,
        caption: true,
        thead: true,
        tbody: true,
        tfoot: true,
        tr: true,
        th: true,
        td: true,
        col: true,
        colgroup: true,
        
        // Forms
        form: true,
        input: true,
        textarea: true,
        button: true,
        select: true,
        optgroup: true,
        option: true,
        label: true,
        fieldset: true,
        legend: true,
        datalist: true,
        output: true,
        progress: true,
        meter: true,
        
        // Media
        img: true,
        picture: true,
        figure: true,
        figcaption: true,
        audio: true,
        video: true,
        source: true,
        track: true,
        embed: true,
        object: true,
        param: true,
        iframe: true,
        map: true,
        area: true,
        svg: true,
        canvas: true,
        
        // Scripting
        script: true,
        noscript: true,
        template: true,
        
        // Other
        style: true,
        link: true,
        meta: true,
        title: true,
        base: true,
        details: true,
        summary: true,
        dialog: true,
        slot: true,
        
        // Deprecated but still might appear in copied content
        center: true,
        font: true,
        big: true,
        tt: true,
        acronym: true,
        applet: true,
        basefont: true,
        dir: true,
        frame: true,
        frameset: true,
        noframes: true,
        isindex: true,
        listing: true,
        menuitem: true,
        nextid: true,
        noembed: true,
        plaintext: true,
        rb: true,
        rtc: true,
        spacer: true,
        strike: true,
        xmp: true
      },

      uploader: {
        insertImageAsBase64URI: false,
        url: env?.VITE_API_BASE_URL + 'upload-edior-image',
        format: 'json',
        pathVariableName: 'path',
        filesVariableName: function (t) {
          return 'file';
        },
        headers: {
          'x-api-key': env?.VITE_LICENCE,
        },
        prepareData: function (formData) {
          return formData;
        },
        isSuccess: function (resp) {
          return !resp.error;
        },
        getMsg: function (resp) {
          if (!resp.msg) return 'Unknown error';
          return Array.isArray(resp.msg) ? resp.msg.join(' ') : resp.msg;
        },
        process: function (resp) {
          return {
            files: [resp.data],
            path: '',
            baseurl: '',
            error: resp.error ? 1 : 0,
            msg: resp.msg
          };
        },
        defaultHandlerSuccess: function (data, resp) {
          const files = data.files || [];
          console.log('Files uploaded:', files);
          if (files.length) {
            this.selection.insertImage(files[0], null, 250);
          }
        },
        defaultHandlerError: function (resp) {
          this.events.fire('errorPopap', this.i18n(resp.msg));
        },
        withCredentials: false,
      },
      popup: {
        defaultTimeout: 0
      },
      buttons: [
        'source', '|',
        'bold',
        'strikethrough',
        'underline',
        'italic', '|',
        'ul',
        'ol', '|',
        'outdent', 'indent', '|',
        'font',
        'fontsize',
        'source', '|',
        'bold', 'strikethrough', 'underline', 'italic', '|',
        'ul', 'ol', '|', 'outdent', 'indent', '|',
        'font', 'fontsize', 'brush', 'paragraph', '|',
        'image', 'video', 'table', 'link', '|',
        'align', 'undo', 'redo', '|',
        'hr', 'eraser', 'copyformat', '|',
        'symbol', 'fullsize', 'print', 'about'
      ],
      buttonsXS: [
        'bold', 'image', '|',
        'brush', 'paragraph', '|',
        'align', '|',
        'undo', 'redo', '|',
        'eraser', 'dots'
      ],
    };
    return (
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={(content) => form.setFieldValue(field?.name, content)}
        onChange={(newContent) => setContent(newContent)}
      />
    );
  }, [content, form, field?.name, disabled]);
};


const FeatureManager = ({ field, form, options, values, setFieldValue }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureValue, setFeatureValue] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");

  const handleAddFeature = () => {
    if (!selectedFeature || !featureValue) return;

    const newFeatures = {
      ...values.features,
      [selectedFeature.id]: {
        name: selectedFeature.name,
        description: featureDescription,
        value: parseInt(featureValue),
      },
    };

    setFieldValue("features", newFeatures);
    setSelectedFeature(null);
    setFeatureValue("");
    setFeatureDescription("");
  };

  const handleRemoveFeature = (featureKey) => {
    const newFeatures = { ...values.features };
    delete newFeatures[featureKey];
    setFieldValue("features", newFeatures);
  };

  return (
    <div className="feature-manager">
      <div className="d-flex gap-2 mb-3">
        <Field
          name="featureSelector"
          component={Select2}
          options={options}
          value={selectedFeature}
          onChange={setSelectedFeature}
          placeholder="Select Feature"
          className="form-control no-outline-select"
        />
        <Field
          type="text"
          name="feature_description"
          placeholder="feature description"
          value={featureDescription}
          onChange={(e) => setFeatureDescription(e.target.value)}
          className="form-control"
        />

        <Field
          style={{ width: "25%" }}
          type="number"
          name="featureValue"
          placeholder="Value"
          value={featureValue}
          onChange={(e) => setFeatureValue(e.target.value)}
          className="form-control"
        />
        <button
          type="button"
          className="btn btn-primary px-4"
          onClick={handleAddFeature}
        >
          Add
        </button>
      </div>

      {Object.keys(values.features || {}).length > 0 && (
        <div className="feature-list w-full">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Sr No.</th>
                <th scope="col">Feature Name</th>
                <th scope="col">Description</th>
                <th scope="col">Value</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(values.features || {}).map(([key, feature]) => (
                <tr key={key}>
                  <th scope="row">{key}</th>
                  <td>{feature.name}</td>
                  <td>{feature.description}</td>
                  <td>{feature.value}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveFeature(key)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// const MultiFileUpload = ({ form, field, multiple = false, label, disabled }) => {
//     const [files, setFiles] = useState([]);

//     const onDrop = (acceptedFiles) => {
//       setFiles(acceptedFiles);
//     };

//   return (
//     <div>
//         <Dropzone onDrop={onDrop} multiple={true}accept="image/*">
//         {({ getRootProps, getInputProps }) => (
//             <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} name={field?.name} />
//             <p>Drag & drop some files here, or click to select files</p>
//             </div>
//         )}
//         </Dropzone>

//         <div className="file-previews">
//         {files.map((file, index) => (
//             <div key={index} className="file-preview">
//             <img src={URL.createObjectURL(file)} alt={file.name} width="100" />
//             <p>{file.name}</p>
//             </div>
//         ))}
//         </div>
//     </div>
//   );
// };

export {
  PictureInput,
  PictureInputSmall,
  Checkbox,
  Select2,
  SelectMultiple,
  TextEditer,
  PictureInputPreview,
};
export default MyForm;
