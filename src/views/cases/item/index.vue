<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="项目名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

        <el-form-item label="检查类型" prop="category">
        <el-select v-model="queryParams.category" placeholder="请选择检查类型" clearable size="small">
          <el-option
            v-for="dict in categoryOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['cases:item:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>


    <el-table
      v-loading="loading"
      :data="itemList"
      row-key="itemId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >

      <el-table-column label="项目名称"  prop="itemName" ></el-table-column>
      <el-table-column label="检查类型"  prop="category" :formatter="categoryFormat" ></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cases:item:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['cases:item:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cases:item:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination-->
      <!--v-show="total>0"-->
      <!--:total="total"-->
      <!--:page.sync="queryParams.pageNum"-->
      <!--:limit.sync="queryParams.pageSize"-->
      <!--@pagination="getList"-->
    <!--/>-->

    <!-- 添加或修改检查项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="上级项目">
          <treeselect
            v-model="form.pid"
            :options="itemOptions"
            :show-count="true"
            placeholder="选择上级项目" />
        </el-form-item>


        <el-form-item label="检查类型">
          <el-select v-model="form.category" placeholder="请选择检查类型"  @change="categoryChange">
            <el-option
              v-for="dict in categoryOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="项目名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入项目名称" />
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listItem,treeselect, getItem, delItem, addItem, updateItem, exportItem } from "@/api/cases/item";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from '@/utils/auth'

export default {
  components: { Treeselect },
  data() {
    return {
      loading: true,
      ids: [],
      query:{
        category:undefined,
      },
      itemList: [],
      itemOptions:[],
      title: "",
      open: false,
      categoryOptions: [],
      queryParams: {

        itemName: undefined,
        pid: undefined,
        category: undefined,

      },
      form: {},
      rules: {
        itemName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  watch:{
    'form.pid':'pidChange'
  },
  created() {
    this.getList();
    this.getDicts("case_item_type").then(response => {
      this.categoryOptions = response.data;
    });
  },
  methods: {

    pidChange(val){
      // console.log(val)
      if(val!=undefined) {
        getItem(val).then(response => {
          this.form.category = response.data.category;
        });
      }
    },
    categoryChange(val){
      // console.log(val)
      this.form.pi4d  = undefined;
      this.query.category = val;
      treeselect(this.query).then(response => {
        this.itemOptions = [];
        const t = { id: 0, label: '大类', children: [] };
        t.children = response.data;
        this.itemOptions.push(t);
      });
    },
    getList() {
      this.fileUploadApi = process.env.VUE_APP_BASE_API;
      this.loading = true;

      listItem(this.queryParams).then(response => {
        this.itemList = response.data;
        this.loading = false;
      });
    },
    // 上传文件
    beforeUpload(file) {
      var testmsg = /^image\/(jpeg|png|jpg|gif|bmp)$/.test(file.type);
      if (!testmsg) {
        this.$message.error('上传图片格式不正确！')
        return
      }
      let isLt2M = true;
      let mysize = "";
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false;
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      if( file.size > 1024*1024){
        mysize = ( file.size / 1024 / 1024 ).toFixed(2) +"M";
      }else if( file.size > 1024 ){
        mysize = ( file.size / 1024 ).toFixed(2) +"K";
      }else{
        mysize = size.toFixed(2) + "B";
      }
      return isLt2M
    },
    handleSuccess(res) {
      console.log(res);
      this.geturl = res.fileName;
      this.$refs.upload.clearFiles();
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },

    getTreeselect() {
      treeselect().then(response => {
        this.itemOptions = [];
        const t = { id: 0, label: '大类', children: [] };
        t.children = response.data;
        this.itemOptions.push(t);
      });
    },

    categoryFormat(row, column) {
      return this.selectDictLabel(this.categoryOptions, row.category);
    },
    cancel(category) {
      this.open = false;
      this.reset();
    },
    reset() {
      this.geturl="";
      this.form = {
        itemId: undefined,
        itemName: undefined,
        pid: undefined,
        category: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.itemId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.pid = row.itemId;
        this.form.category = row.category;
      }
      this.open = true;
      this.title = "添加检查项目";

    },
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const itemId = row.itemId || this.ids
      getItem(itemId).then(response => {

        this.form = response.data;
        this.open = true;
        this.title = "修改检查项目";
      });
    },
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (this.form.itemId != undefined) {
            updateItem(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addItem(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    handleDelete(row) {
      // const itemIds = row.itemId || this.ids;
      this.$confirm('是否确认删除项目名称为"' + row.itemName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delItem(row.itemId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有检查项目数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportItem(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
